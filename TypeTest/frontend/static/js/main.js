//object that handles newlines
var newline = new NewLine();
newline.create("TypeTest [Version 1.01], All Rights Reserved.", 100, true)

//tagElement refers to the span that contains the prompt tag.
var tagElement = document.getElementById("tag")
var tagElementName = document.getElementById("tag-name")
var tag = tagElement.innerHTML

//main element container for terminal
let mainContainer = document.getElementById("main");

//refers to the div that holds both the tag and input spans.
var inputElement = document.getElementById("terminalInput")
inputElement.style.display = "none" //hidden for sake of animation

var current_command;
var commands = [];

//refers to the input span.
let input = document.getElementById("input");
const commandList = ["help", "clear", "tag", "run"]

//shows and focuses on input on load.
setTimeout(() => {
    inputElement.style.display = "block"
    input.focus();
}, 400);

//all sub programs
var typetest = new TypeTest(inputElement);
var snake = new Snake(inputElement);
var pong = new Pong(inputElement);

//focuses the users caret onto the current input span (on document click).
document.addEventListener('click', function(){input.focus()})
input.addEventListener("keydown", function(event){
    if(event.code === 'Tab'){
        event.preventDefault()
    }
    else if(event.code === "ArrowUp"){
        event.preventDefault();
    }
    else if(event.code === "ArrowDown"){
        event.preventDefault();
    }
})

let submission = function(event) {
    event.preventDefault()
    let inputValue = convertToPlain(input.innerHTML);
    if(event.code === 'Tab' && inputValue.length > 0){
        let subCommandList = commandList.filter(str => str.startsWith(inputValue))
        console.log(subCommandList)
        switch (true){
            case subCommandList[0] == "clear":
                input.innerText = "clear"
                setCarat(input)
                break;
            case subCommandList[0] == "help":
                input.innerText = "help"
                setCarat(input)
                break;
            case subCommandList[0] == "run":
                input.innerText = "run"
                setCarat(input)
                break;
            case subCommandList[0] == "tag":
                input.innerText = "tag"
                setCarat(input)
                break;
        }
    }
    if (event.code === 'Enter'){
        //formatting the users input, i.e. sanitising input.
        inputValue = inputValue.replace("/", "")
        console.log("isolated input: " + inputValue)

        //handing off input to the input handler
        inputResponse(inputValue)
        newline.create(tag + input.innerHTML, 0);
        input.innerHTML = "";

        //this if statement helps filter out empty entries from the list of previous entries
        if(inputValue.replace(" ", "")!=""){
            commands.push(inputValue)
        }
        current_command = commands.length;
    }
    else if (event.code === "ArrowUp" && current_command != 0){
        event.preventDefault();
        current_command -= 1
        setCommandValue();
    }
    else if (event.code === "ArrowDown" && current_command != commands.length){
        event.preventDefault();
        current_command += 1
        setCommandValue();
    }
}
//handles the submission of the input
input.addEventListener('keyup', submission)

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
            case text.includes("0x0000"): //empty newline on enter
                text = "";
                break;
            case text.includes("0x0001"): //clear
                while(document.getElementsByClassName("line").length > 0){
                    document.getElementsByClassName("line")[0].remove()
                }
                break;

            case text.includes("0x0002"): //tag -n
                text = text.replace("0x0002", "")
                tagElementName.innerHTML = text+"@type-test"
                tag = tagElement.innerHTML;
                text = "name successfully changed to: " + text;
                newline.create(text);
                break;

            case text.includes("0x0003"): //tag -c
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

            case text.includes("0x0004"): //typetest
                typetest.run(text.replace("0x0004", ""))
                window.scrollTo(0, 0)
                break;

            case text.includes("0x0005"): //snake
                snake.run()
                window.scrollTo(0, 0)
                break;

            case text.includes("0x0006"): //pong
                pong.run()
                window.scrollTo(0, 0)
                break;

            default: //response is formatted from backend
                console.log("running")
                newline.create(text, 0, true)
                break;
        }
        if(document.getElementById("main") != null){
            console.log(document.getElementById("main"));
            window.scrollTo(0, document.body.scrollHeight)
        }
    });
}

//this cosntructor should build spans that make up the terminal history
function NewLine(){
    this.newline;
    let that = this;
    let typeRate;
    this.create = function(text, time = 0, animate = false){
        setTimeout(function() {
            this.text = text;
            that.newline = document.createElement("span")
            that.newline.className = "line"
            mainContainer.appendChild(that.newline)

            if(animate){
                console.log("animating")
                //formatting the text so that there are no escaped characters
                //this problem occurs when injecting the chars one by one
                this.textarea = document.createElement('textarea');
                this.textarea.innerHTML = this.text;
                this.text = textarea.value

                //let spaces = this.text.split(/<br>| | /) .filter(str => str != "")
                let breaks = this.text.split("<br>")

                //ensure that the loop runs for an appropriate amount of time
                let iterate = this.text.length

                if(breaks.length > 1){
                    iterate = iterate - breaks.length*2 //- (breaks.length*4) - nbsp.length
                }

                for(let j = 0; j<this.text.length; j++){
                    if(this.text[j] == " "){
                        iterate--
                    }
                }

                console.log(this.text)

                typeRate = 1;
                //increases typeRate to 2 to keep stuff shorter in general.
                if(this.text.length*10>1000){
                    if(!this.text.length%2 == 0){
                        this.text += " "
                    }
                    typeRate = 2
                }

                input.removeEventListener("keyup", submission)
                tagElement.style.display = "none"
                let i = 0;
                const typingInterval = setInterval(() => {
                    if(i < iterate) {
                        that.newline.innerHTML = this.text.substr(0, typeRate*i);
                        window.scrollTo(0, document.body.scrollHeight)
                        i= i + typeRate;
                        //console.log("running", i)
                    }else{
                        console.log(this.text.length, i)
                        console.log("starting")
                        input.addEventListener("keyup", submission)
                        tagElement.style.display = "inline"
                        inputElement.style.display = "block"
                        input.focus()
                        window.scrollTo(0, document.body.scrollHeight)
                        clearInterval(typingInterval);
                    }
                }, 10);
            }else{
                console.log("no animate")
                that.newline.innerHTML = this.text
            }
        }, time);
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

function setCarat(element){
    element.focus()
    window.getSelection().selectAllChildren(element)
    window.getSelection().collapseToEnd()
}

//ensures that contenteditables dont get <br> added in when enter is pressed
input.onkeydown = function(e){
    if(e.code === 'Enter'){
        if(!e){
            e = window.event;
        }
        if(e.preventDefault){
            e.preventDefault();
        }
        else{
            e.returnValue = false;
        }
    }
    window.scrollTo(0, document.body.scrollHeight)
};

function print(text){
    console.log(text)
}

