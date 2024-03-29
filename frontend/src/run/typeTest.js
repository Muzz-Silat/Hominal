function TypeTest(terminalInput){
    let that = this;
    var timerRunning = false

    this.terminal = document.getElementById("main")

    this.run = function(sentence){

        while(document.getElementsByClassName("typed")[0] != null){
            document.getElementsByClassName("typed")[0].classList.remove("typed")
        }

        that.terminal = document.getElementById("main")
        that.terminal.remove()
        this.container = that.createElement("div", "container", "")
        this.container.style.display = "block"
        this.container.style.width = window.innerWidth
        this.container.style.height = "95vh"
        terminalInput.before(this.container)
        terminalInput.style.display = "none"

        this.timer = that.createElement("span", "timer", "timer")
        this.timer.innerText = ""

        this.words = that.createElement("div", "", "words")
        this.container.appendChild(this.timer)
        this.container.appendChild(this.words)

        this.input = that.createElement("input", "type-testInput", "")
        this.words.before(this.input)

        this.caret = that.createElement("div", "caret", "caret blink")
        this.container.appendChild(this.caret)

        this.test_input = sentence;
        this.words.innerHTML = that.displayTextGenerator(this.test_input)

        this.letters = document.getElementsByTagName("letter")

        for(i = 0; i < this.letters.length; i ++){
            this.letters[i].className = "default"
        }

        document.addEventListener("click", function(){that.input.focus()})

        this.input.value = "";
        this.input.focus()
        that.moveCaret(this.letters[0], this.caret, this.letters[0])
        let keysPressed = {};

        this.input.addEventListener("input", function(event){
            input.focus()
            if(!timerRunning){
                var initialTime = Date.now()
                var difference = 0
                timerRunning = true
                that.timer.innerText = "0s"
                that.interval = setInterval(function(){
                    difference = (Date.now() - initialTime)/1000
                    if (timerRunning){
                        this.timer.innerText = (Math.round((difference + Number.EPSILON) * 100) / 100).toFixed(2)
                        + "s"
                    }
                    else{
                        clearInterval(interval)
                        timerRunning = false
                        this.timer.innerText = ""
                    }
                }, 10)
            }
            if (that.input.value.length > 0){
                that.caret.className = "caret"
                for(i = that.input.value.length; i < that.letters.length; i ++){
                    if(that.letters[i].className != "incorrect ghost"){
                        that.letters[i].className = "default"
                    }
                }
            }
            else{
                that.caret.className = "caret blink"
                for(let i = 0; i<that.letters[i].length; i++){
                    if(that.letter[i].className.includes("ghost")){
                        that.letters[i].remove()
                    }
                }
            }
            for(i = 0; i < that.input.value.length; i++){
                if(that.input.value[i] == that.letters[i].innerText && that.letters[i].className != "incorrect ghost"){
                    that.letters[i].className = "correct"
                    that.progress()
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
                //waiting for user to hit enter on completion of test
                that.input.disabled = true;
                that.caret.remove()
                this.finished = that.createElement("span", "", "testFin")
                this.finished.innerText = "Press enter to continue..."
                that.container.appendChild(this.finished)
                timerRunning = false
                clearInterval(that.interval)
                let here = this;
                this.allowExit = function(e){
                    if(e.key == "Enter"){
                        document.removeEventListener("keyup", here.allowExit)
                        that.exit()
                    }
                }
                document.addEventListener("keyup", this.allowExit)
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
            if((keysPressed['Control'] || keysPressed['Meta']) && event.key == 'c'){
                that.exit()
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
                this.element.style.borderColor = "grey";
            }
        }
        this.multiplier = this.cLetters/(this.letters.length-1)

        //slowly transitioning the border colors from grey to greenyellow
        switch(true){
            case this.multiplier > 0.75:
                this.colorMult = (this.multiplier-0.75)/0.25;
                this.element.style.borderBottomColor = `rgb(${128+(49*(this.colorMult))}, ${128+(127*(this.colorMult))}, ${128-(73*(this.colorMult))})`;

            case this.multiplier > 0.50:
                this.colorMult = (this.multiplier-0.50)/0.25;
                this.element.style.borderRightColor = `rgb(${128+(49*(this.colorMult))}, ${128+(127*(this.colorMult))}, ${128-(73*(this.colorMult))})`;

            case this.multiplier > 0.25:
                this.colorMult = (this.multiplier-0.25)/0.25;
                this.element.style.borderTopColor = `rgb(${128+(49*(this.colorMult))}, ${128+(127*(this.colorMult))}, ${128-(73*(this.colorMult))})`;

            case this.multiplier > 0.0:
                this.colorMult = (this.multiplier-0)/0.25;
                this.element.style.borderLeftColor = `rgb(${128+(49*(this.colorMult))}, ${128+(127*(this.colorMult))}, ${128-(73*(this.colorMult))})`;
        }

        //these only start applying the style after a border is progressed fully
        switch(true){
            case this.multiplier == 1.0:
                this.element.style.borderBottomColor = "greenyellow";
            case this.multiplier > 0.75:
                this.element.style.borderRightColor = "greenyellow";
            case this.multiplier > 0.50:
                this.element.style.borderTopColor = "greenyellow";
            case this.multiplier > 0.25:
                this.element.style.borderLeftColor = "greenyellow";
        }

        for(let i = 0; i < this.letters.length; i++){
            if(this.letters[i].className.includes("incorrect")){
                this.element.style.borderColor = "red";
            }
        }
    }

    this.returnToHome = function(){
        terminalInput.before(that.terminal)
        terminalInput.style.display = ""
        document.getElementById("input").focus()
        window.scrollTo(0, document.body.scrollHeight)
    }

    this.exit = function(){
        clearInterval(that.interval)
        timerRunning = false

        let default_letters = document.getElementsByClassName("default")
        let incorrect_letters = document.getElementsByClassName("incorrect")
        if(default_letters.length === 1 && incorrect_letters.length === 0){

            numOfWords = that.words.innerText.split(" ").length
            timeTaken = this.timer.innerText.replace("s", "")
            wpm = (numOfWords/timeTaken) * 60
            wpm = Math.round((wpm + Number.EPSILON))

            newline.create(
                `
                    <result class="line typed topresult">
                        <rtype>TIME</rtype>
                        <rvalue>${timeTaken}s</rvalue>
                    </result>
                `, 0
            )
            newline.create(
                `
                    <result class="line typed">
                        <rtype>WORDS</rtype>
                        <rvalue>${numOfWords}</rvalue>
                    </result>
                `, 200
            )
            newline.create(
                `
                    <result class="line typed">
                        <rtype>WPM</rtype>
                        <rvalue>${wpm}</rvalue>
                    </result>
                    </rtable>
                `, 400
            )
        }

        this.container.remove()
        this.returnToHome()
    }
}