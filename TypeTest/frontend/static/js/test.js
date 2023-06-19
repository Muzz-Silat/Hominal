let test = document.getElementsByClassName("terminal-input")[0];
console.log(test);

const compareto = `C:\\User\\TypeTest>`;

function testinjection(){
    if(!(test.value.includes(compareto)) || test.value[0] != 'C'){
        test.value = compareto
    }

    test.selectionStart = test.selectionEnd = test.value.length;

    this.style.height = 'auto';
    this.style.height =
        (this.scrollHeight) + 'px';
}
test.addEventListener('input', testinjection)
document.addEventListener('click', function(){
    test.selectionStart = test.selectionEnd = test.value.length;
})
document.getElementById('command')
.addEventListener('keyup', function(event) {
    if (event.code === 'Enter')
{
        event.preventDefault();
        document.querySelector('form').submit();
    }
});