function authentification(cb) {
    fs.readFile('../../key.pem', (err, key) => {
        if (err) throw err;
        fs.readFile('../../cert.pem', (err, cert) => {
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

function init(req, authrequest, random_key, cb) {
    authrequest.post("https://localhost:8443/1.0/containers/" + req.body.env + "/files?path=/root/" + random_key, {
        headers: {
            "X-LXD-type": "directory"
        }
    }, (error, _, body) => {
        if (error) throw error;
        authrequest.post("https://localhost:8443/1.0/containers/" + req.body.env + "/files?path=/root/" + random_key + "/app" + req.body.ext, {
            body: Buffer.from(req.body.data, 'utf8'),
        }, (error, _, body) => {
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
            authrequest.post("https://localhost:8443/1.0/containers/" + req.body.env + "/files?path=/root/" + random_key + filename, {
                body: Buffer.from(requirement(req.body.data, req.body.env), 'utf8'),
            }, (error, _, body) => {
                if (error) throw error;
                cb();
            });
        });
    });
}

function install(req, authrequest, random_key, cb) {
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
    }, (error, _, body) => {
        if (error) throw error;
        authrequest.get("https://localhost:8443" + body.operation + "/wait", (error, _, body) => {
            if (error) throw error;
            cb();
        });     
    });
}

function execute(req, authrequest, random_key, cb) {
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
        authrequest.get("https://localhost:8443" + body.operation + "/wait", (error, _, body) => {
            if (error) throw error;
            let json = JSON.parse(body);
            authrequest.get("https://localhost:8443" + json.metadata.metadata.output[1], (error, _, stdout) => {
                if (error) throw error;
                authrequest.get("https://localhost:8443" + json.metadata.metadata.output[2], (error, _, stderr) => {
                    if (error) throw error;
                    cb(stdout, stderr);
                });
            });
        });
    });
}

module.exports = (req, res, next) => {
    authentification((key, cert) => {
        const random_key = Math.random().toString().slice(2);
        const authrequest = request.defaults({
            rejectUnauthorized: false,
            agentOptions: {
                key: key,
                cert: cert
            }
        });
        init(req, authrequest, random_key, () => {
            install(req, authrequest, random_key, () => {
                execute(req, authrequest, random_key, (stdout, stderr) => {
                    return res.status(200).json({
                        stdout: stdout,
                        stderr: stderr
                    });
                });
            });
        });
    });
};