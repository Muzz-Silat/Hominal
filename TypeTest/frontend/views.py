

from django.shortcuts import render
from django.http import HttpResponse, Http404


# Create your views here.
def homepage(request):
    return render(request, "homepage.html")

def commands(request, command = None):
    print(request)
    print(command)
    match command:
        case "help":
            return HttpResponse("\'{}\' is currently currently unreleased".format(command))
        case None:
            return HttpResponse("0x0000")
        case "clear":
            return HttpResponse("0x0001")
        case _:
            return HttpResponse("\'{}\' is not recognized as an internal or external command,operable program or batch file.".format(command))
# from django.shortcuts import render
# from django.http import HttpResponse
# from django.template import loader  

# def homepage(request):
#     template = loader.get_template('homepage.html')
#     if request.method == 'POST':
#         command = request.POST['command']
#         command = command.removeprefix("C:\\User\\TypeTest>")
#         command = command.split() [0]
#         print(command)
#         context = {}
#         if command == 'help':
#             context = {
#                 'response': 'TESTING',
#             }
#             return render(request, 'homepage.html', {'context': context})
#     else:
#         return render(request, 'homepage.html')