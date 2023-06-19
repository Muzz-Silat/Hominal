let test = document.getElementsByClassName("terminal-input")[0];
console.log(test);

const compareto = `C:\\User\\TypeTest>`;

function testinjection(){
    if(!(test.value.includes(compareto))){
        test.value = compareto
    }

    test.selectionStart = test.selectionEnd = test.value.length;

    this.style.height = 'auto';
    this.style.height =
        (this.scrollHeight) + 'px';
}


test.addEventListener('input', testinjection)