let test = dotestent.getElementById("test");
console.log(test);

const compareto = `C:\\User\\TypeTest>`;

function testinjection(){
    if(!(test.innerText.includes(compareto))){
        test.innerText = compareto
    }
}


test.addEventListener('input', testinjection)