var tagElement = document.getElementById("tag")
var tag = tagElement.innerHTML

var inputElement = document.getElementById("terminalInput")
let input = document.getElementById("input");

input.focus();


// function cursorHandler(){
//     //ensures the tag remains the same
//     if(!(input.value.includes(tag)) || input.value[0] != 'C'){
//         input.value = tag;
//     }

//     //keeps the textarea size good
//     input.style.height = 'auto';
//     input.style.height =
//     (input.scrollHeight) + 'px';

//     if(input.selectionStart == input.selectionEnd && input.selectionStart < tag.length){
//         input.selectionStart = input.selectionEnd = tag.length;
//     }
// }

// input.addEventListener('input', cursorHandler)
// document.addEventListener('click', cursorHandler)
// input.addEventListener('keyup', cursorHandler)

document.getElementById('input')
.addEventListener('keyup', function(event) {
    if (event.code === 'Enter'){
        //event.preventDefault();
        //document.querySelector('form').submit();

        //formatting output from the textarea to the true user input (inputValue)
        let inputValue = convertToPlain(input.innerHTML);
        console.log("isolated input: " + inputValue)

        //handing off input to the input handler
        inputResponse(inputValue)

        let newline = document.createElement("span")
        newline.style.display = "block"
        console.log(input.value)
        newline.innerHTML = tag + input.innerHTML;
        inputElement.before(newline)
        input.innerHTML = "";
    }
});

function convertToPlain(html){
    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

function inputResponse(inputVal) {   
    fetch(`/commands/${inputVal}`)
    .then(response => response.text())
    .then(text => {
        console.log(text);
        let newline = document.createElement("span");

        if(text == "0x0001"){
            
        }else{
            newline.innerHTML = text;
            inputElement.before(newline)
        }
    });
}