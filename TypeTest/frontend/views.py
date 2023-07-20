from django.shortcuts import render
from django.http import HttpResponse, Http404
from .helpcmd import help
from .tagcmd import tag
from .runcmd import run


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
        case "help":
            return HttpResponse(help(keywords))
        case "clear":
            return HttpResponse("0x0001")
        case "tag":
            return HttpResponse(tag(keywords))
        case "run":
            return HttpResponse(run(keywords))
        case None:
            #all codes are handled through js on frontend
            return HttpResponse("0x0000")
        case _:
            return HttpResponse("\'{}\' is not recognized as an internal or external command,operable program or batch file.".format(command))
