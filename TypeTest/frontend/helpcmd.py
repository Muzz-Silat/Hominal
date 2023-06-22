from .reponsedev import responseDeveloper


indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9"
indentC = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
space = "&nbsp;"
br = "<br>"

def help(specify = None):
    if(len(specify) <= 1):
        definition = [
            "TypeTest, version 1.01 (web-django)",
            "These shell commands are defined internally.  Type `help' to see this list.",
            "Type `help command' to find out more about the function `command'.",
            "Use `type-test' to find out more in general.",
            "A star (*) next to a name means that the command is disabled.",
            br+br,
        ]

        commands = [
            "clear/" + "[-c]",

            "help/" + "[command]",

            "tag/" + "{[-n]} " + " {[-c]}" + br,
            indentC + "options:/" + " ",
            indent + "-n/ {str}",
            indent + "color/ {hex}" + br,

        ]

        for i in range(len(commands)):
            commandforward = ""
            if len(commands[i].split("9")) > 1:
                commandforward = commands[i].split("9")[0]
                commands[i] = commands[i].split("9")[1]


            command = commands[i].split("/")
            params = command[1]
            command = command[0]
            commands[i] = command
            if len(command) != 8:
                for j in range(8-len(command)):
                    commands[i] = commands[i] + space
                commands[i] = commandforward+commands[i]+params
        
        print (commands)
        return(responseDeveloper(definition+commands))

    #else:
        