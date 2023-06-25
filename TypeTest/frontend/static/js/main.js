//object that handles newlines
var newline = new NewLine();

//tagElement refers to the span that contains the prompt tag.
var tagElement = document.getElementById("tag")
var tagElementName = document.getElementById("tag-name")
var tag = tagElement.innerHTML

//refers to the div that holds both the tag and input spans.
var inputElement = document.getElementById("terminalInput")

var current_command;
var commands = [];

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
        commands.push(inputValue)
        current_command = commands.length;
    }
    else if (event.code === "ArrowUp" && current_command != 0){
        current_command -= 1
        setCommandValue();
    }
    else if (event.code === "ArrowDown" && current_command != commands.length){
        current_command += 1
        setCommandValue();
    }
});

function setCommandValue(){
    if (commands[current_command] === undefined){
        input.innerHTML = ""
    }
    else {
        input.innerHTML = commands[current_command]
    }
    setCarat(input)
}

function inputResponse(inputVal) {
    fetch(`/commands/${inputVal}`)
    .then(response => response.text())
    .then(text => {
        console.log(text);
        switch(true){
            case text.includes("0x0000"):
                text = "";
                break;
            case text.includes("0x0001"):
                while(document.getElementsByClassName("line").length > 0){
                    document.getElementsByClassName("line")[0].remove()
                }
                break;
            case text.includes("0x0002"):
                text = text.replace("0x0002", "")
                tagElementName.innerHTML = text+"@type-test"
                tag = tagElement.innerHTML;
                text = "name successfully changed to: " + text;
                newline.create(text);
                break;

            case text.includes("0x0003"):
                text = text.replace("0x0003", "");
                if(text == "default"){
                    tagElementName.style.color = 'rgb(138,223,50)'
                    tag = tagElement.innerHTML;
                }
                else if(text.includes("hex(")){
                    text = text.replace("hex(", "").replace(")", "")
                    tagElementName.style.color = `#${text}`

                }
                else if(text.includes("rgb(")){
                    text = text.replace("rgb(", "").replace(")", "")
                    tagElementName.style.color = `rgb(${text})`
                }
                else{
                    tagElementName.style.color = text
                }
                tag = tagElement.innerHTML;

                text = "color changed successfully! if this is untrue, please see help tag.";
                newline.create(text);
                break;
            case text.includes("0x0004"):
                let obj = new typeTest(inputElement);
                obj.run()
                break;
            default:
                console.log("running")
                newline.create(text);
                window.scrollTo(0, document.body.scrollHeight)
                break;
        }
        window.scrollTo(0, document.body.scrollHeight)
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

function exit(terminalInput){
    var container = document.getElementById("container")
    console.log("exit is called")
    container.remove()
    terminalInput.style.display = ""
    input.focus()
}

function convertToPlain(html){
    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element 
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

function setCarat(element) {
    element.focus()
    window.getSelection().selectAllChildren(element)
    window.getSelection().collapseToEnd()
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
    window.scrollTo(0, document.body.scrollHeight)
};

function print(text){
    console.log(text)
}