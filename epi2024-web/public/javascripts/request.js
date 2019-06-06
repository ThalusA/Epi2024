function validate(id){
    for (let idx = 0; idx < numberOfRequest; idx++) {
        const element = array[idx];
        
    }
}

function refuse(id){

}

requestIds.forEach(function (id){
    document.getElementById(id+"V").addEventListener("click", function() {
        validate(idx);
    }, false);
    document.getElementById(id+"R").addEventListener("click", function() {
        refuse(idx);
    }, false);
});