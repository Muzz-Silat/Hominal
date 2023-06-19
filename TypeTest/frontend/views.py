from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader  

def homepage(request):
    template = loader.get_template('test.html')
    if request.method == 'POST':
        command = request.POST['command']
        command = command.replace("C:\\User\\TypeTest>", "")
        command = command.replace("\n", "")
        print(len(command))
        context = {}
        if command == 'help':
            print('hello')
            # context = {
            #     'response': 'TESTING',
            # }
            # return HttpResponse(template.render(context,template))
    else:
        print('not a post request')
    return render(request, 'homepage.html')