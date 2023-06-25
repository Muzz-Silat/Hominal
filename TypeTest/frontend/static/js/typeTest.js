function typeTest(terminalInput){
    let that = this;

    this.run = function(){
        this.container = that.createElement("div", "container", "")
        this.container.style.display = "block"
        this.container.style.width = window.innerWidth
        this.container.style.height = "95vh"
        terminalInput.before(this.container)
        terminalInput.style.display = "none"

        this.words = that.createElement("div", "", "words")
        this.container.appendChild(this.words)

        this.input = that.createElement("input", "type-testInput", "")
        this.words.after(this.input)

        this.caret = that.createElement("div", "caret", "caret")
        this.container.appendChild(this.caret)

        this.test_input = "The quick brown fox painted all over the fence"
        this.words.innerHTML = that.displayTextGenerator(this.test_input)

        this.letters = document.getElementsByTagName("letter")

        for(i = 0; i < this.letters.length; i ++){
            this.letters[i].className = "default"
        }
        window.scrollTo(0, document.body.scrollHeight);

        document.addEventListener("click", function(){that.input.focus()})

        window.addEventListener("scroll", function(){
            window.scrollTo(0, document.body.scrollHeight);
        })


        this.input.value = "";
        this.input.focus()
        that.moveCaret(this.letters[0], this.caret, this.letters[0])
        let keysPressed = {};

        this.input.addEventListener("input", function(event){
            input.focus()
            that.progress()
            if (that.input.value.length > 0){
                for(i = that.input.value.length; i < that.letters.length; i ++){
                    if(that.letters[i].className != "incorrect ghost"){
                        that.letters[i].className = "default"
                    }
                }
            }else{
                for(let i = 0; i<that.letters[i].length; i++){
                    if(that.letter[i].className.includes("ghost")){
                        that.letters[i].remove()
                    }
                }
            }
            for(i = 0; i < that.input.value.length; i++){
                if(that.input.value[i] == that.letters[i].innerText && that.letters[i].className != "incorrect ghost"){
                    that.letters[i].className = "correct"
                }
                else{
                    if(that.letters[i].innerText == " "){
                        let ghost = that.createElement("letter", "", "incorrect ghost")
                        ghost.innerText = that.input.value[i]
                        that.letters[i].before(ghost)
                        that.letters = document.getElementsByTagName("letter")
                    }else if(that.letters[i].className != "incorrect ghost"){
                        that.letters[i].className = "incorrect"
                    }
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
            if(default_letters.length === 1 && incorrect_letters.length === 0){
                new exit(terminalInput)
            }
        })

        this.input.addEventListener("keyup", function(event){
            input.focus()
            that.progress()
            delete keysPressed[event.key]
            if(event.code === "Backspace"){
                for(i = that.input.value.length; i < that.letters.length; i ++){
                    if(!that.letters[i].className.includes("ghost")){
                        that.letters[i].className = "default"
                    }
                    else{
                        that.letters[i].remove()
                    }
                }
            }
            this.caretIndex = that.input.value.length;
            if(this.caretIndex<=that.letters.length-1){
                that.moveCaret(
                    that.letters[this.caretIndex],
                    that.caret,
                    that.letters[0]
                )
            }
        })
        this.input.addEventListener("keydown", function(event){
            keysPressed[event.key] = true;
            if(keysPressed['Control'] && event.key == 'c'){
                    new exit(terminalInput)
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
            this.html += "<letter class='default space'> </letter>";
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
        this.caret.style.fontsize = "2rem"
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

    this.progress = function(){
        let that = this;
        this.cLetters = 0;
        this.element = document.getElementsByClassName("words")[0]


        for(let i = 0; i < this.letters.length; i++){
            if(this.letters[i].className == "correct"){this.cLetters++;}
            else{
                this.element.style.borderColor = "white";
            }
        }
        this.multiplier = this.cLetters/this.letters.length

        console.log(this.multiplier)

        switch(true){
            case this.multiplier > 0.90:
                this.element.style.borderLeftColor = "greenyellow";
            case this.multiplier > 0.75:
                this.element.style.borderBottomColor = "greenyellow";
            case this.multiplier > 0.50:
                this.element.style.borderRightColor = "greenyellow";
            case this.multiplier > 0.25:
                this.element.style.borderTopColor = "greenyellow";
        }

        for(let i = 0; i < this.letters.length; i++){
            if(this.letters[i].className.includes("incorrect")){
                this.element.style.borderColor = "red";
            }
        }
    }
}