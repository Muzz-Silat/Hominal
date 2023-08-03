var shortcutsOBJ;

function Set(){
    this.configs = [
        shortcutsOBJ =  new Shortcuts()
    ]

    this.initialize = function(){
        //initializes all other set sub functions
        for(config of this.configs){
            config.init()
        }
    };

    this.edit = function(command){
        switch(true){
            case(command.includes("shortcuts")):
                shortcutsOBJ.configure(command.replace("shortcuts", ""))
                break;
            default:
                newline.create("pwease enter a valid pawameter")
        }
    };
}