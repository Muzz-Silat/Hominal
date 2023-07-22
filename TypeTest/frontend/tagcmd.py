from .reponsedev import responseDeveloper

def tag(command):

    if(len(command) == 3):
        match command[1]:
            case "-n":
                return "0x0002"+command[2]

            case "-c":
                return "0x0003"+command[2]

            case _:
                return responseDeveloper(["please enter a valid expression.<br>",
                        "-n: {str} cannot have any spaces.<br>",
                        "-c: {color} must be a valid color. see 'help tag' for more information"])
    return "invalid number of parameters, please ensure your expression is formatted correctly. see 'help tag' for more details."