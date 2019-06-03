function validate(id){
    for (let idx = 0; idx < numberOfRequest; idx++) {
        const element = array[idx];
        
    }
}

function refuse(id){

}


for (var idx = 0; idx < numberOfRequest; idx++) {
    document.getElementById(idx+"V").addEventListener("click", function() {
        validate(idx);
    }, false);
    document.getElementById(idx+"R").addEventListener("click", function() {
        refuse(idx);
    }, false);
}