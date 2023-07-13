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