const tag = `C:\\User\\TypeTest>`;

let input = document.getElementsByClassName("terminal-input")[0];
input.focus();
cursorHandler();



function cursorHandler(){
    //ensures the tag remains the same
    if(!(input.value.includes(tag)) || input.value[0] != 'C'){
        input.value = tag;
    }

    //keeps the textarea size good
    input.style.height = 'auto';
    input.style.height =
    (input.scrollHeight) + 'px';

    if(input.selectionStart == input.selectionEnd && input.selectionStart < tag.length){
        input.selectionStart = input.selectionEnd = tag.length;
    }
}

input.addEventListener('input', cursorHandler)
document.addEventListener('click', cursorHandler)
input.addEventListener('keyup', cursorHandler)

document.getElementById('command')
.addEventListener('keyup', function(event) {
    if (event.code === 'Enter'){
        //event.preventDefault();
        //document.querySelector('form').submit();

        //formatting output from the textarea to the true user input (inputValue)
        let inputValue = input.value;
        inputValue = inputValue.replace(tag, "")
        console.log("isolated input: " + inputValue)

        //handing off input to the input handler
        inputResponse(inputValue)

        let newline = document.createElement("span");
        console.log(input.value)
        newline.innerHTML = input.value;
        input.before(newline)
        input.value = tag;
    }
});


function inputResponse(inputVal) {   
    fetch(`/commands/${inputVal}`)
    .then(response => response.text())
    .then(text => {
        console.log(text);
        let newline = document.createElement("span");

        if(text == "0x0001"){
            
        }else{
            newline.innerHTML = text;
            input.before(newline)
        }
    });
}