from django.shortcuts import render
from django.http import HttpResponse, Http404
from .helpcmd import help
from .tagcmd import tag
from .runcmd import run
from .reponsedev import responseDeveloper
import random

def generateHingi():
    hingiArray = []
    hingus = []
    with open("./frontend/data/hingus.txt", "r") as hingus_file:
        i = 0
        hingi = hingus_file.readlines()
        while(i<hingi.__len__()-1):
            print(hingi[i])
            hingusLen = int(hingi[i].split("##")[2])
            i+=1
            for j in range(hingusLen):
                hingus.append(hingi[i+j])
            hingiArray.append(hingus)
            hingus = []
            i+=hingusLen
        hingus_file.close()
    return hingiArray

hingi = generateHingi()

# Create your views here.
def homepage(request):
    return render(request, "homepage.html")

def commands(request, command = None):
    if(command != None):
        keywords = ' '.join(command.split())
        keywords = keywords.split(" ")
        command = keywords[0]

    # handling an input of only spaces
    if (command == ''):
        command = None

    match command:
        case "intro":
            return HttpResponse(responseDeveloper(intro))
        case "help":
            return HttpResponse(help(keywords))
        case "clear":
            if(len(keywords) > 1):
                if(keywords[1] == "-a"):
                    return HttpResponse("0x0001-a")
                elif(keywords[1] == "-h"):
                    return HttpResponse("0x0001-h")
            return HttpResponse("0x0001")
        case "tag":
            return HttpResponse(tag(keywords))
        case "run":
            return HttpResponse(run(keywords))
        case "search":
            return HttpResponse("0x1111")
        case None:
            #all codes are handled through js on frontend
            return HttpResponse("0x0000")
        case "hingus":
            randHingus = random.choice(hingi)
            return HttpResponse("9x9999"+ responseDeveloper(randHingus))
        case _:
            return HttpResponse("\'{}\' is not recognized as an internal or external command, operable program or batch file.".format(' '.join(keywords)))

intro = [
    "Hominal Interactive Nexus, [v1.00-alpha], All Rights Reserved.",
    "These shell commands are defined internally. Type 'help' to see this list of commands.",
    ""
]