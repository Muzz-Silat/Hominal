
def tag(command):

    if(len(command) == 3):
        match command[1]:
            case "-n":
                return "0x0002"+command[2]
            
            case "color":
                return "0x0003"+command[2]
            
            case _:
                return "please enter a valid epression"
    return "invalid number of parameters"