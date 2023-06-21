from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader  

def homepage(request):
    template = loader.get_template('homepage.html')
    if request.method == 'POST':
        command = request.POST['command']
        command = command.removeprefix("C:\\User\\TypeTest>")
        command = command.split() [0]
        print(command)
        context = {}
        if command == 'help':
            context = {
                'response': 'TESTING',
            }
            return render(request, 'homepage.html', {'context': context})
    else:
        return render(request, 'homepage.html')