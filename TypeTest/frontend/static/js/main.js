//object that handles newlines
var newline = new NewLine();
newline.create("TypeTest [Version 1.01], All Rights Reserved. ", 100, true)

//tagElement refers to the span that contains the prompt tag.
var tagElement = document.getElementById("tag")
var tagElementName = document.getElementById("tag-name")
var tag = tagElement.innerHTML

//main element container for terminal
let mainContainer = document.getElementById("main");

//refers to the div that holds both the tag and input spans.
var inputElement = document.getElementById("terminalInput")
inputElement.style.display = "none" //hidden for sake of animation

//refers to the input span.
let input = document.getElementById("input");
const commandList = ["help","hello", "clear", "tag", "run"]

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

var commands = [
    [["help", "clear", "run", "tag", "hellomyguy"]],
    [[".", "clear.", "tag.", "run."], ["","-c"], ["typetest", "snake", "pong"], ["-c", "-n"]]
]
//will store the currently typed command.
//will reset when last index of it contains a "."
let typedCommand = ""

//the command traversal coordinates
let commandRow = 0;
let commandCol = 0;
let shiftCommandIndex = 0;
let previousInput = "";

//runs every time 'tab' is pressed. will only match it's the only possibility.
//alternatively, it will cycle through the list of possible commands if 'shift+tab' is pressed.
let displayCommand = function(possibleCommands, shiftThrough){
    let shiftCommands = []
    if(shiftThrough){
        if(shiftCommandIndex>possibleCommands.length-2){shiftCommandIndex=0}
        else{shiftCommandIndex++}
        console.log(possibleCommands)
        input.innerHTML = typedCommand + " " + possibleCommands[shiftCommandIndex]
        console.log(shiftCommandIndex)
    }
    else if(possibleCommands.length == 1){
        input.innerText = possibleCommands[0]
    }
    setCarat(input)
}

let filterCommands = function(string){
    return commands[commandRow][commandCol].filter(str => str.startsWith(string))
}

let possibleCommands = commands[0][0];
let submission = function(event) {
    event.preventDefault()
    let inputValue = convertToPlain(input.innerHTML);

    console.log(event.code)
    if(event.code === 'AltRight'){
        displayCommand(possibleCommands, true)
    }

    if(event.code === 'Tab'){
        console.log("row: "+commandRow)
        console.log("col: "+commandCol)
        console.log("possibleC: "+possibleCommands)
        typedCommand = ''

        let userInput = inputValue.split(" ").filter(str => str != "");
        for(let i = 0; i < userInput.length; i++){
            userInput[i] = userInput[i].trim()
        }
        console.log(userInput)

        if(userInput.length > 0){
            commandRow = 0;
            commandCol = 0;
            let commandIncomplete = false; //assumed as false unless first if statement below fails at the last point.
            console.log("running this function")
            for(let i = 0; i < userInput.length; i++){
                console.log("running for: "+userInput[i])
                if(filterCommands(userInput[i]).length == 1){
                    let currArray = commands[commandRow][commandCol]
                    for(let j = 0; j < currArray.length; j++){
                        console.log("running if statement")
                        console.log(currArray[j], userInput[i])
                        if(currArray[j] == userInput[i]){
                            console.log(j)
                            commandCol = j;
                            commandRow++
                            j = currArray.length;
                            commandIncomplete = false;
                        }else if(i == userInput.length-1){
                            commandIncomplete = true;
                            console.log("incomplete")
                        }
                        //to find out whether the last command in the string is completed/valid
                    }
                }
                else if(i == userInput.length-1){
                    commandIncomplete = true;
                    console.log("incomplete")
                }
                //if statements fail in unexpected way, commands are likely invalid and hence gibberish
                else{
                    console.log("gibberish entered"+ userInput[i]+5)
                    i = userInput.length
                    commandCol = 0;
                    commandRow = 0;
                }
            }
            //at this point, we will have traced the users input to its command string.
            //we can now determine whether this input is valid, and where it can go from here.
            //if valid, commandRow will have a value greater than 0.
            if(commandIncomplete){
                possibleCommands = filterCommands(userInput[userInput.length-1]);
                console.log(possibleCommands)
            }else if(!commandIncomplete){
                typedCommand = userInput
                try{
                    possibleCommands = commands[commandRow][commandCol]
                    if(possibleCommands.length == 1 && possibleCommands[0] == "."){
                        possibleCommands = []
                    }
                }catch(e){
                    console.log("no more rows exist")
                }
            }
        }
        //when tab is pressed but input is empty, meaning that user wants to see available commands
        else{
            possibleCommands = commands[commandRow][commandCol];
        }

        let stringPossibleCommands = ""
        try{
            for(str of possibleCommands){
                stringPossibleCommands += str.replace(".", "")+" "
            }
        }catch(e){
            stringPossibleCommands = inputValue+"*"
        }

        //handles printing of the possible commands to the terminal
        //also prevents printing out the same thing over an over
        try{
            if(document.getElementsByClassName("line")[document.getElementsByClassName("line").length-1].innerHTML != stringPossibleCommands){
                newline.create(tag + input.innerHTML, 0);
                newline.create(stringPossibleCommands, 0)
            }
            else{

            }
        }catch(e){
            newline.create(tag + input.innerHTML, 0);
            newline.create(stringPossibleCommands, 0)
        }
    }
    if (event.code === 'Enter'){
        typedCommand = ''
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

