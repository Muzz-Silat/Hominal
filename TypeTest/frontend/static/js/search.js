function Search(query) {
    let that = this;
    this.base = "https://www.google.com/search?q=";
    this.search = function(){
        query = query.replace("search ", "");
        result = window.open(that.base + query, "_blank"); 
        if(!result || result.closed || typeof result.closed=='undefined') { 
            //POPUP BLOCKED
            newline.create("popups are disabled, so this feature won't work. Try enabling popups to use search feature", 0, true)
        }
    }   
}
