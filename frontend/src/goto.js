function Goto() {
    this.goto = function(url){
        newline.create("redirecting to: "+url+" ", 0, true)
        result = window.open("https://www." + url, "_blank");
        if(!result || result.closed || typeof result.closed == 'undefined') {
            //POPUP BLOCKED
            newline.create("popups are disabled, so this feature won't work. Try enabling popups to use search feature", 0, true)
        }
    }
}
