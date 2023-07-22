//newline.js,
//handles hominal home-screen new line creation and display.
//* this file is a requirement for main.js, fatal errors will be encountered if removed, or edited incorrectly.
//#############################################################
/**
 * @constructor
 * Creates a span with the class "line" that is injected into the DOM. Lines make up hominal's history.
 */
function NewLine() {
    //The instance variable for the newly created line element.
    this.newline;
    //Reference to the NewLine instance.
    let that = this;
    //Variable to control the typing speed of the animated text.
    let typeRate;
    //Reference to the input element.
    let input = document.getElementById("input");

    /**
     * Creates a new line in the DOM with optional animation and delay.
     * @type function()
     * @param {string} text - The string you want to print to the DOM.
     * @param {number} [time=0] - The delay (in milliseconds) before adding the line to the DOM. Default is 0.
     * @param {boolean} [animate=false] - Whether you want the line to be animated. Default is false.
     * @returns {void}
     */
    this.create = function (text, time = 0, animate = false, typeRate = 1) {
      setTimeout(function () {
        this.text = text;
        //Create a new span element to represent the line.
        that.newline = document.createElement("span");
        that.newline.className = "line";
        mainContainer.appendChild(that.newline);

        if (animate) {
            //Format the text to remove escaped characters.
            this.textarea = document.createElement('textarea');
            this.textarea.innerHTML = this.text;
            this.text = textarea.value;

            //Calculate the appropriate number of iterations for the typing animation.
            //this number will always be >= to the actual number of iteration required
            let iterate = this.text.length;

            //Calculate the typing speed (typeRate) based on the text length.
            if (this.text.length * 10 > 1000 && typeRate == 1) {
                if (!this.text.length % 2 == 0) {
                    this.text += " ";
                }
                typeRate = 2;
            }

            //Temporarily remove the input event listener and hide the tag element for animation.
            input.removeEventListener("keyup", submission);
            tagElement.style.display = "none";
            let i = 0;

            //Typing animation interval.
            const typingInterval = setInterval(() => {
                if (i < iterate) {
                    //Update the line's content with the typed text.
                    that.newline.innerHTML = this.text.substr(0, typeRate * i);
                    window.scrollTo(0, document.body.scrollHeight);

                    //ends the iteration loop early if needed since 'iterate' value can be much higher than the number of visible chars depending on the text.
                    if(this.text.substr(0, typeRate * i-1).includes(this.text)){
                        i = iterate
                    }

                    i = i + typeRate;
                } else {
                    //Restore input element and show tag element after animation is done.
                    input.addEventListener("keyup", submission);
                    tagElement.style.display = "inline";
                    inputElement.style.display = "block";
                    input.focus();
                    window.scrollTo(0, document.body.scrollHeight);
                    clearInterval(typingInterval);
                }
            }, 10);
        } else {
          //No animation, directly set the line's content.
          that.newline.innerHTML = this.text;
        }
      }, time);
    };
}
