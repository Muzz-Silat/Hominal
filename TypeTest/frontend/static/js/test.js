//object that handles newlines
var newline = new NewLine();

//tagElement refers to the span that contains the prompt tag.
var tagElement = document.getElementById("tag")
var tag = tagElement.innerHTML

//refers to the div that holds both the tag and input spans.
var inputElement = document.getElementById("terminalInput")

//refers to the input span.
let input = document.getElementById("input");

//focuses on input on load.
input.focus();

//focuses the users caret onto the current input span (on document click).
document.addEventListener('click', function(){input.focus()})

//handles the submission of the input
input.addEventListener('keyup', function(event) {
    if (event.code === 'Enter'){
        //formatting the users input, i.e. sanitising input.
        let inputValue = convertToPlain(input.innerHTML);
        inputValue = inputValue.replace("/", "")
        console.log("isolated input: " + inputValue)

        //handing off input to the input handler
        inputResponse(inputValue)
        newline.create(tag + input.innerHTML);
        input.innerHTML = "";
    }
});

function inputResponse(inputVal) {   
    fetch(`/commands/${inputVal}`)
    .then(response => response.text())
    .then(text => {
        console.log(text);
        switch(text){
            case "0x0000":
                text = "";
                break;
            case "0x0001":
                while(document.getElementsByClassName("line").length > 0){
                    document.getElementsByClassName("line")[0].remove()
                }
                break;
            default:
                newline.create(text);
                break;
        }
    });
}

//this cosntructor should build spans that make up the terminal history
function NewLine(){
    this.newline;
    let that = this;
    this.create = function(text){
        this.text = text;
        that.newline = document.createElement("span")
        that.newline.className = "line"
        that.newline.innerHTML = this.text;
        inputElement.before(that.newline)
    }
}

function convertToPlain(html){
    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

//ensures that contenteditables dont get <br> added in when enter is pressed
input.onkeydown = function (e) {
    if(e.code === 'Enter'){
        if (!e) {
            e = window.event;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
};