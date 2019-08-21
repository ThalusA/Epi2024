function authentification(cb) {
    fs.readFile('../key.pem', (err, key) => {
        if (err) throw err;
        fs.readFile('../cert.pem', (err, cert) => {
            if (err) throw err;
            cb(key, cert);
        });
    });
}

function requirement(data, env) {
    let match;
    let requirements;
    let regex;
    switch (env) {
        case "node":
            regex = new RegExp(/require\('([\w-]*)'\)/, 'gm');
            requirements = {
                "main": "app.js",
                "dependencies": {}
            };
            while ((match = regex.exec(data)) != null)
                requirements.dependencies[match[1]] = "latest";
            return JSON.stringify(requirements);
        case "python3":
            regex = new RegExp(/(from\s+([\w-]+)\s+import\s+[\w-]+|import\s+([\w-]+))/, 'gm');
            requirements = "";
            while ((match = regex.exec(data) != null)) 
                if (match[3] == null) requirements += (match[2] + "\n");
                else requirements += (match[3] + "\n");
            return requirements;
    }
}

module.exports = (req, res, next) => {
    authentification((key, cert) => {
        const random_key = Math.random().toString().slice(2);
        const authrequest = request.defaults({
            agentOptions: {
                key: key,
                cert: cert
            }
        });
        authrequest.post("https://localhost:8443/1.0/containers/" + req.body.env + "/exec", {
            json: true,
            body: {
                "command": ["/bin/mkdir /root/" + random_key],
                "environment": {},
                "wait-for-websocket": false,
                "record-output": false,
                "interactive": true
            }
        }, (error) => {
            if (error) throw error;
            authrequest.post("https://localhost:8443/1.0/containers/" + req.body.env + "/files?path=/root/" + random_key + "/app" + req.body.ext, {body: req.body.data}, (error) => {
                if (error) throw error;
                let filename;
                switch (req.body.env) {
                    case "node":
                        filename = "/package.json";
                        break;
                    case "python3":
                        filename = "/requirements.txt";
                        break;
                }
                authrequest.post("https://localhost:8443/1.0/containers/" + req.body.env + "/files?path=/root/" + random_key + filename, {body: requirement(req.body.data, req.body.env)}, (error) => {
                    if (error) throw error;
                    let command;
                    switch (req.body.env) {
                        case "node":
                            command = "/usr/local/bin/npm install -g /root/" + random_key;
                            break;
                        case "python3":
                            command = "/usr/bin/pip3 install -r /root/" + random_key + "/requirements.txt";
                            break;
                    }
                    authrequest.post("https://localhost:8443/1.0/containers/" + req.body.env + "/exec", {
                        json: true,
                        body: {
                            "command": [command],
                            "environment": {},
                            "wait-for-websocket": false,
                            "record-output": false,
                            "interactive": true
                        }
                    }, (error) => {
                        if (error) throw error;
                        let start;
                        switch (req.body.env) {
                            case "node":
                                start = "/usr/local/bin/node /root/" + random_key + "/app.js";
                                break;
                            case "python3":
                                start = "/usr/bin/python3 /root/" + random_key + "/app.py";
                                break;
                        }
                        authrequest.post("https://localhost:8443/1.0/containers/" + req.body.env + "/exec", {
                            json: true,
                            body: {
                                "command": [start],
                                "environment": {},
                                "wait-for-websocket": false,
                                "record-output": true,
                                "interactive": true
                            }
                        }, (error, _, body) => {
                            if (error) throw error;
                            const json = JSON.parse(body);
                            authrequest.get("https://localhost:8443" + json.output[1], (error, __, body) => {
                                if (error) throw error;
                                const stdout = JSON.parse(body);
                                authrequest.get("https://localhost:8443" + json.output[2], (error, ___, body) => {
                                    if (error) throw error;
                                    const stderr = JSON.parse(body);
                                    return res.status(200).json({
                                        stdout: stdout,
                                        stderr: stderr
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }); 
    });
};