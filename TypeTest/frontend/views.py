from django.shortcuts import render
from django.http import HttpResponse, Http404
from .helpcmd import help


# Create your views here.
def homepage(request):
    return render(request, "homepage.html")

def commands(request, command = None):
    print(request)
    print(command)
    
    if(command != None):
        keywords = ' '.join(command.split())
        keywords = keywords.split(" ")
        command = keywords[0]

    match command:
        case "help":
            return HttpResponse(help(keywords))
        case None:
            #all codes are handled thorugh js on forntend
            return HttpResponse("0x0000")
        case "clear":
            return HttpResponse("0x0001")
        case _:
            return HttpResponse("\'{}\' is not recognized as an internal or external command,operable program or batch file.".format(command))
