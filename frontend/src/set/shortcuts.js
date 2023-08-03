var shortcuts = ""
function Shortcuts(shortcutsOBJ){
    this.shortcuts = [];
    this.init = function(){
        //ensure contains data relating
        if(localStorageEmpty){
            setLocalvar(
                `shortcuts`,
                `yt,youtube.com;tt,tiktok.com;disc,discord.com`
            );
        }
        shortcuts = getLocalvar("shortcuts");
        this.map()
    }

    //run every time we change shortcuts array.
    this.map = function(){
        //shortcuts<shortcut<command+link
        this.shortcuts = []
        commands[0][0] = commandsDuplicate.slice();
        for(let shortcut of shortcuts.split(";")){
            this.shortcuts.push([shortcut.split(",")[0], shortcut.split(",")[1]])
            commands[0][0].push(shortcut.split(",")[0])
        }
    }

    this.configure = function(input){
        console.log(input)
        shortcuts = input.replace(" ", "");
        setLocalvar("shortcuts", shortcuts);
        this.map()
    }

    this.execute = function(input){
        for(let shortcut of this.shortcuts){
            if(shortcut[0] == input){
                console.log(shortcut[1])
                goto.goto(shortcut[1])
                return true;
            }
        }
    }
}