from .typetest import simpleGenerator

def run(command):
    match command[1]:
        case "typetest":
                if len(command)<3:
                    return "0x0004"+simpleGenerator(10)
                else:
                    try:
                        return "0x0004"+simpleGenerator(int(command[2]))
                    except:
                        return command[2]+" is not a number"
        case "snake":
            return "0x0005"
        case "pong":
            return "0x0006"
        case "tetris":
            return "0x0007"
        case "breakout":
            return "0x0008"