from .reponsedev import responseDeveloper


indent = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;9"
indentC = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
indentS = "&nbsp;&nbsp;&nbsp;&nbsp;"


space = "&nbsp;"
br = "<br>"


def help(specify):
    if(len(specify) <= 1):
        commands = [
            "<cmd class='highlight'>help   [command]   display help for a specific command.</cmd>"
            +br+br,
            "clear  [-a]"
            +br,
            "tag    {[-n]}  {[-c]}"
            +br,
            "   options:",
            "       -n      {string}    tagname, no spaces.",
            "       -c      {color}     css colors, rgb(x,x,x), hex(xxxxxx)."
            +br,
            "run    {program}"
        ]

        return(responseDeveloper(commands))

    elif(len(specify) == 2):
        command = specify[1]
        match command:
            case "clear":
                array = [
                    indentC+"NAME",
                    indentC+indentS+"clear - clear the terminal screen.",
                    br,
                    indentC+"COMMAND",
                    indentC+indentS+"clear",
                    br,
                    indentC+"DESCRIPTION",
                    indentC+indentS+"clears your screen if this is possible."
                ]
                return (responseDeveloper(array))

            case "tag":
                    array1 = [
                        indentC+"NAME",
                        indentC+indentS+"tag - allows customization of prompt tag.",
                        br,
                        indentC+"COMMAND",
                        indentC+indentS+"tag, immediate parameter: [-n, -c] are required.",
                        br,
                        indentC+"DESCRIPTION"
                    ]

                    array2 = [
                        indentC+indentS+"-n:"+indentS+"{Name} cannot have any spaces.<br>",
                        indentC+indentS+"-c:"+indentS+"{Color} must be a valid hex color in the format hex(XXXXXX),",
                        indentC+indentS+"or an RGB color in the format 'rgb(x,x,x)'.",
                        indentC+indentS+"Alternatively, a predefined CSS color, i.e:<br>",
                        indentC+indentS+indentS+"- Red",
                        indentC+indentS+indentS+"- Orange",
                        indentC+indentS+indentS+"- Yellow",
                        indentC+indentS+indentS+"- Green",
                        indentC+indentS+indentS+"- Blue",
                        indentC+indentS+indentS+"- Purple",
                        indentC+indentS+indentS+"- Pink",
                        indentC+indentS+indentS+"- Brown",
                        indentC+indentS+indentS+"- Gray",
                        indentC+indentS+indentS+"- Black"+br,
                        indentC+indentS+"or simply type 'default' to return to the original color."
                    ]
                    return (responseDeveloper(array1 + array2))

            case "run":
                array1 = [
                        indentC+"NAME",
                        indentC+indentS+"run - command used to start a program.",
                        br,
                        indentC+"COMMAND",
                        indentC+indentS+"run, immediate parameter: [program name] is required.",
                        br,
                        indentC+"DESCRIPTION"
                    ]
                array2 = [
                        indentC+indentS+indentS+"- typetest: Test your typing speed."+br,
                        indentC+indentS+indentS+"options:",
                        indentC+indentS+indentS+indentS+"-w:"+indentS+"{Words}, This mode lets you test your typing speed for a certain number of words.",
                        indentC+indentS+indentS+indentS+"-t:"+indentS+"{Time}, This mode lets you test your typing speed for a certain number of seconds.",
                    ]
                return (responseDeveloper(array1 + array2))
