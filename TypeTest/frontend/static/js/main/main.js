//main.js initializes hominal and manages
//eventListeners for the main home-screen and some of the global variables required for hominal.
//#############################################################
//BELOW ARE VARIABLES THAT MUST REMAIN GLOBAL
//object that handles newlines, requires newline.js
var newline = new NewLine();
fetch(`/commands/intro`).then(response => response.text()).then(text => newline.create(text+"<br>"+`Last Login: ${new Date().toLocaleString(undefined, {weekday: "short", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit"}).replace(" at ", " ")} on <cmd class="highlight">${navigator.userAgent.split("(")[1].split(")")[0].replaceAll(";", "")}<cmd>`, 200, true));
//tagElement refers to the span that contains the prompt tag.
var tagElement = document.getElementById("tag")
var tagElementName = document.getElementById("tag-name")
var tag = tagElement.innerHTML
var tagName = tagElementName.innerText      //is stored in localStorage
var tagColor = tagElementName.style.color   //is stored in localStorage

//commandManager() makes use of these variables during runtime.
var current_command;
var commandsHistory = [];                   //is stored in localStorage

//loads and sets any variables that are stored in localStorage
//you should define and initiate any variables that are stored in locStorage before this code.
if (typeof(Storage) !== "undefined") {
    // Code for localStorage/sessionStorage.
    if (localStorage.length == 0){
        console.log("running for the first time")
        localStorage.setItem("tagName", tagName)
        localStorage.setItem("tagColor", tagColor)
        localStorage.setItem("commandsHistory", [])
    };
    //sets the name
    tagElementName.innerText = localStorage.getItem("tagName");
    //sets the color
    tagColor = localStorage.getItem("tagColor")
    tagElementName.style.color = tagColor;

    //sets the combination and ensures everything initializes correctly
    tag = tagElement.innerHTML
    commandsHistory = getLocalvar("commandsHistory").split("…").filter(str => str != "")
    current_command = commandsHistory.length;
} else {
    // Sorry! No Web Storage support..
    alert("Your browser does not support Web Storage. All changes in this session will be lost on refresh.");
}

//main container for hominal, where the terminal interface is shown.
let mainContainer = document.getElementById("main");

//refers to the div that holds both the tag and input spans.
let inputElement = document.getElementById("terminalInput")
inputElement.style.display = "none" //hidden for sake of animation

//refers to the input span.
let input = document.getElementById("input");
let inputValue;

//all sub programs
var typetest = new TypeTest(inputElement);
var snake;
var pong;
var tetris;
var breakout;
var search;
//#############################################################

//shows and focuses on input on load with a slight.
setTimeout(() => {
    inputElement.style.display = "block"
    input.focus();
}, 400);

//actively scrolls to bottom of page on update to height
let bodyHeight = document.body.scrollHeight
let scroll = setInterval(function(){
    let currentHeight = document.body.scrollHeight
    if(currentHeight != bodyHeight){
        bodyHeight = currentHeight
        window.scrollTo(0, bodyHeight)
    }
},10);

//Below are functions that pertain to event listeners required for the hominal home screen.
//They are defined and added in the same order.

/*
handles:
    1.) the prediction of commands when the user presses 'tab'
            - requires commandFiller.js

    2.) the indexing of commands used by the user to generate a 'command history'
            - no linked scripts, everything that pertains can be found in this function or in main.js.
*/
let commandManager = function(event){
    //ensuring inputValue is up to date.
    inputValue = convertToPlain(input.innerHTML);
    //resetting variables when no input has been entered yet.
    if(inputValue == ""){
        possibleCommands = commands[0][0]
        typedCommand = "";
        commandIndex = 0;
    }
    if(event.code === 'Tab'){
        //commandFiller.js:commandDictionary() is run to obtain values for commandRow and col.
        commandDictionary(inputValue);
        //commandFiller.js:printPossibleCommands(), prints out possibleCommands[].
        printPossibleCommands()
        //commandFiller.js:autoFill(), filters users input against array (possibleCommands[]) and loops through filtered, filling in whatever value is at index:commandIndex
        autoFill(possibleCommands)
    }
    if(event.code === 'Backspace'){
        //reruns commandDictionary() on backspace to ensure commandRow and col remain up to date with user input change.
        commandDictionary(inputValue);
        //runs commandFiller.js:filterer() so that possibleCommands[] is filtered with userInput.
        if(userInput.length>0){
            filterer()
        }
    }
    if(event.code === 'Space'){
        //'space' indicates that user wants to type a sub-command, so we must check validate row and col again.
        commandDictionary(inputValue);
    }

    //'enter' means the command has been entered, and user input = "" for the purposes of this function.
    if (event.code === 'Enter'){
        //reset typedCommand, which is used to keep track of what has been typed by the user during the making of an expression.
        typedCommand = ''

        //2.) handles how commandsHistory[] is affected by pressing enter.
        //this if statement helps filter out empty entries from the list of previous entries.
        if(inputValue.replace(" ", "")!=""){
            commandsHistory.push(inputValue)
            let commandsHistoryTemp = "";
            for(let i = 0; i < commandsHistory.length; i++){
                commandsHistoryTemp += commandsHistory[i] + "…"
            }
            setLocalvar("commandsHistory", commandsHistoryTemp)
        }
        current_command = commandsHistory.length;
    }
    //2.) current_commands increments/decrements depending on arrow key press.
    else if (event.code === "ArrowUp" && current_command != 0){
        event.preventDefault();
        current_command -= 1
        setCommandValue();
    }
    else if (event.code === "ArrowDown" && current_command != commandsHistory.length){
        event.preventDefault();
        current_command += 1
        setCommandValue();
    }
    //2.) sets the input elements value, dependent on current_command
    function setCommandValue(){
        if (commandsHistory[current_command] === undefined){
            input.innerHTML = ""
        }
        else {
            input.innerHTML = commandsHistory[current_command]
        }
        //sets the caret at the end of the input.
        setCarat(input)
    }
}

//handles submission of user input to backend, no linked scripts.
let submission = function(event) {
    event.preventDefault()
    let inputValue = convertToPlain(input.innerHTML);

    if (event.code === 'Enter'){
        //formatting the users input, i.e. sanitizing input.
        inputValue = inputValue.replace("/", "")
        console.log("isolated input: " + inputValue)

        //handing off input to the input handler
        inputResponse(inputValue)
        newline.create(tag + input.innerHTML, 0);
        input.innerHTML = "";
    }
}

//ensures that content-editable elements don't get <br> added in when enter is pressed. no linked scripts.
let removeBR = function(e){
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
};

//ensures that focus remains on input field for added convenience
let keepFocus = function(e){
    input.focus()
}

let preventDefault = function(e){
    if(event.code === 'Tab'){
        event.preventDefault()
    }
    else if(event.code === "ArrowUp"){
        event.preventDefault();
    }
    else if(event.code === "ArrowDown"){
        event.preventDefault();
    }
}

//all event listeners required for home screen can be found here. they can be removed by calling this function with condition = false.
let mainEventListeners = function(condition){
    if(condition){
        input.addEventListener('keyup', commandManager)
        input.addEventListener('keyup', submission)
        input.addEventListener('keydown', removeBR)

        //ensures that focus remains on input field for added convenience
        //document.addEventListener('keydown', keepFocus)
        document.addEventListener('click', keepFocus)

        input.addEventListener('keydown', preventDefault)

        //commandFiller.js:filterer()
        input.addEventListener('input', filterer);


    //############################## REMOVE ########################################
    }else{
        input.removeEventListener('keyup', commandManager)
        input.removeEventListener('keyup', submission)
        input.removeEventListener('keydown', removeBR)

        //ensures that focus remains on input field for added convenience
        //document.removeEventListener('keydown', keepFocus)
        document.removeEventListener('click', keepFocus)

        input.addEventListener('keydown', preventDefault)

        //commandFiller.js:filterer()
        input.removeEventListener('input', filterer);
    }
}
mainEventListeners(true);

function inputResponse(inputVal) {
    fetch(`/commands/${inputVal}`)
    .then(response => response.text())
    .then(text => {
        console.log(text);
        //we add a space here to fix a bug with the newline.create() animation. it leaves out the last character, so space acts as a sacrificial char.
        switch(true){
            case text.includes("0x0000"): //empty newline on enter
                text = "";
                break;
            case text.includes("0x0001"): //clear
                if(text == "0x0001"){
                    while(document.getElementsByClassName("line").length > 0){
                        document.getElementsByClassName("line")[0].remove()
                    }
                    break;
                }
                else{
                    if(text.includes("-a")){
                        commandsHistory = []
                        setLocalvar("commandsHistory", [])
                        while(document.getElementsByClassName("line").length > 0){
                            document.getElementsByClassName("line")[0].remove()
                        }
                        break;
                    }
                    else if(text.includes("-h")){
                        commandsHistory = []
                        setLocalvar("commandsHistory", [])
                        break;
                    }
                    break;
                }
            case text.includes("0x0002"): //tag -n
                text = text.replace("0x0002", "")
                tagElementName.innerHTML = text+"@hominal"
                setLocalvar("tagName", tagElementName.innerText);
                tag = tagElement.innerHTML;

                text = "name successfully changed to: " + text;
                newline.create(text);
                break;
            case text.includes("0x0003"): //tag -c
                text = text.replace("0x0003", "");
                if(text == "default"){
                    setLocalvar("tagColor", "yellowgreen")
                    tag = tagElement.innerHTML;
                }
                else if(text.includes("hex(")){
                    text = text.replace("hex(", "").replace(")", "")
                    setLocalvar("tagColor", `#${text}`)

                }
                else if(text.includes("rgb(")){
                    text = text.replace("rgb(", "").replace(")", "")
                    setLocalvar("tagColor", `rgb(${text})`)
                }
                else{
                    setLocalvar("tagColor", text)
                }
                tagElementName.style.color = getLocalvar("tagColor")
                tag = tagElement.innerHTML;

                text = "color changed successfully! if this is untrue, please see help tag.";
                newline.create(text);
                break;

            case text.includes("0x0004"): //typetest
                typetest.run(text.replace("0x0004", ""))
                window.scrollTo(0, 0)
                break;

            case text.includes("0x0005"): //snake
                snake = new Snake(inputElement);
                snake.run()
                window.scrollTo(0, 0)
                break;

            case text.includes("0x0006"): //pong
                pong = new Pong(inputElement);
                pong.run()
                window.scrollTo(0, 0)
                break;
            case text.includes("0x0007"): //tetris
                tetris = new Tetris(inputElement);
                tetris.run()
                window.scrollTo(0, 0)
                break;    
            case text.includes("0x0008"): //breakout
                breakout = new BreakOut(inputElement);
                breakout.run()
                window.scrollTo(0, 0)
                break;
            case text.includes("0x1111"):
                search = new Search(inputVal);
                search.search()
                break;
            case text.includes("9x9999"):
                if(text.includes('style="')){
                    newline.create(text.replace("9x9999", ""), 0, true, 60)
                }else{
                    newline.create(text.replace("9x9999", ""), 0, true, 20)
                }
                setTimeout(() => {
                    let hingus = document.getElementsByClassName("line")[document.getElementsByClassName("line").length-1]
                    hingus.style.color = invertColor(getLocalvar("tagColor"))
                    hingus.style.fontSize = "2px"
                    hingus.style.lineHeight = "1"
                    console.log(invertColor(getLocalvar("tagColor")))
                }, 30);
                break;

            default: //response is formatted from backend
                console.log("running")
                text += " ";
                if(text.includes("is not recognized as an internal or external command, operable program or batch file.")){
                    newline.create(text, 0, false)
                }
                else{newline.create(text, 0, true)}
                break;
        }
    });
}

function convertToPlain(html){
    // Create a new div element
    var tempDivElement = document.createElement("div");

    // Set the HTML content with the given value
    tempDivElement.innerHTML = html;

    // Retrieve the text property of the element
    return tempDivElement.textContent || tempDivElement.innerText || "";
}

//sets caret to the end of the string on whatever input element is passed in.
function setCarat(element){
    element.focus()
    window.getSelection().selectAllChildren(element)
    window.getSelection().collapseToEnd()
}

//helpful for managing localStorage related variables while including support for browsers that lack it.
function setLocalvar(type, value){
    if (typeof(Storage) !== "undefined") {
        localStorage.setItem(type, value)
    } else {
        window[type] = value;
    }
    return value
}

function getLocalvar(type){
    if (typeof(Storage) !== "undefined") {
        return localStorage.getItem(type);

    } else {
        return window[type];
    }
}

function invertColor(color) {
    let tempElement = document.createElement("div");
    tempElement.style.backgroundColor = color;

    input.before(tempElement);
    channels = getComputedStyle(tempElement).backgroundColor;
    tempElement.remove();

    channels = channels.match(/\d+/g);
    inverted_channels = channels.map(function(ch) {
        return 305 - ch;
    });
    inverted = 'rgb(' + inverted_channels.join(', ') + ')';
    return inverted
}