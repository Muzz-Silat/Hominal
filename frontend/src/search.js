function Search(query) {
    let that = this;
    this.base = "https://www.google.com/search?q=";

    this.search = function(){
        query = this.sanitize(query);

        if(query == ""){
            newline.create("redirecting to: "+"https://www.google.com/ ", 0, true)
        }else{
            newline.create("searching for: "+query+" ", 0, true);
        }
        result = window.open(that.base + query, "_blank");
        if(!result || result.closed || typeof result.closed == 'undefined') {
            //POPUP BLOCKED
            newline.create("popups are disabled, so this feature won't work. Try enabling popups to use search feature", 0, true)
        }
    }

    this.sanitize = function(query){
        console.log(query)
        switch(true){
            //when space after tab
            case query.includes(" search "):
                query = query.replace(" search ", "")
                console.log("user pressed tab, space and hit enter")
                break;
            //when space after "search"
            case query.includes("search "):
                query = query.replace("search ", "")
                console.log("user typed command, pressed space and then hit enter")
                break;
            //when user hits tab
            case query.includes(" search"):
                query = query.replace(" search", "")
                console.log("user pressed tab and hit enter")
                break;
            //when query valid after "search"
            case query.includes("search "):
                query = query.replace("search ", "")
                break;
        }
        console.log(query)
        return query
    }
}
