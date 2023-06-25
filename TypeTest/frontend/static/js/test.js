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
                }else{
                    tagElementName.style.color = "#"+text
                    tag = tagElement.innerHTML;
                }
                text = "color changed successfully!";
                newline.create(text);
                break;
            case text.includes("0x0004"):
                let runobj = new typeTest(inputElement);
                runobj.run()
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

function typeTest(terminalInput){
    let that = this;

    this.run = function(){
        this.container = that.createElement("div", "container", "")
        this.container.style.display = "block"
        this.container.style.width = window.innerWidth
        this.container.style.height = "90vh"
        terminalInput.before(this.container)
        terminalInput.style.display = "none"

        this.words = that.createElement("div", "", "words")
        this.container.appendChild(this.words)

        this.input = that.createElement("input", "type-testInput", "")
        this.words.after(this.input)

        this.caret = that.createElement("div", "caret", "caret")
        this.container.appendChild(this.caret)

        this.test_input = "this is a test sentence"
        this.words.innerHTML = that.displayTextGenerator(this.test_input)

        this.letters = document.getElementsByTagName("letter")
        for(i = 0; i < this.letters.length; i ++){
            this.letters[i].className = "default"
        }
        window.scrollTo(0, document.body.scrollHeight);

        window.addEventListener("scroll", function(){
            window.scrollTo(0, document.body.scrollHeight);
        })


        this.input.value = "";
        this.input.focus()
        that.moveCaret(this.letters[0], this.caret, this.letters[0])
        let keysPressed = {};

        this.input.addEventListener("input", function(event){
            if (that.input.value.length > 0){
                for(i = that.input.value.length; i < that.letters.length; i ++){
                    that.letters[i].className = "default"
                }
            }
            for(i = 0; i < that.input.value.length; i++){
                if(that.input.value[i] == that.letters[i].innerText){
                    that.letters[i].className = "correct"
                }
                else{
                    that.letters[i].className = "incorrect"
                }
                this.caretIndex = that.input.value.length;
                if(this.caretIndex<=that.letters.length-1){
                    that.moveCaret(
                        that.letters[this.caretIndex],
                        that.caret,
                        that.letters[0]
                    )
                }
            }
            let default_letters = document.getElementsByClassName("default")
            let incorrect_letters = document.getElementsByClassName("incorrect")
            console.log(default_letters.length, incorrect_letters.length)
            if(default_letters.length === 1 && incorrect_letters.length === 0){
                exit(terminalInput)
            }
        })

        this.input.addEventListener("keyup", function(event){
            delete keysPressed[event.key]
            if(event.code === "Backspace"){
                for(i = that.input.value.length; i < that.letters.length; i ++){
                    that.letters[i].className = "default"
                }
            }
            this.caretIndex = that.input.value.length;
            if(this.caretIndex<=that.letters.length-1){
                that.moveCaret(
                    that.letters[this.caretIndex],
                    that.caret,
                    that.letters[0]
                )
                console.log(that.letters[this.caretIndex].getBoundingClientRect().left,
                that.letters[this.caretIndex].getBoundingClientRect().top,)
            }
        })
        this.input.addEventListener("keydown", function(event){
            keysPressed[event.key] = true;
            if(keysPressed['Control'] && event.key == 'c'){
                    exit(terminalInput)
            }
        })
    }

    this.createElement = function(eTagname, eId = "", eClass = ""){
        this.el = document.createElement(eTagname);
        this.el.className = eClass;
        this.el.id = eId;
        return this.el
    }


    this.displayTextGenerator = function(sen){
        this.sen = sen.split(" ")
        this.finalSen = [];
        for(var i = 0; i<this.sen.length; i++){
            this.finalSen.push(Object.assign([ ], this.sen[i]))
        }

        this.html = "";
        for(var i = 0; i<this.finalSen.length; i++){
            //creating word tag and closing after for loop
            this.html += "<word>"
            //adds the letters inside the word
            for(var j = 0; j<this.finalSen[i].length; j++){
                this.html += "<letter class='default'>" + this.finalSen[i][j] + "</letter>"
            }
            this.html += "</word>"
            // //adds a space after every word that needs it
            this.html += "<letter class='correct space'> </letter>";
        }
        return this.html;
    }

    this.moveCaret = function(currentLetter, caret, letter){
        currentLetter = that.getPosition(currentLetter);
        this.x = currentLetter[0];
        this.y = currentLetter[1];
        this.caret = caret;
        this.letter = letter;

        this.caret.style.left = this.x.toString()+"px";
        this.caret.style.top = this.y.toString()+"px";
        // this.caret.style.height = letter.offsetLength + "px"
        // this.caret.style.width = (letter.offsetWidth / 5) + "px"
        this.caret.style.fontsize = "1.5rem" 
    }

    this.getPosition = function(elem) {
        var left = 0,
            top = 0;

        do {
            left += elem.offsetLeft;
            top += elem.offsetTop;
        } while ( elem = elem.offsetParent );

        return [left, top];
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