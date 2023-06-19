from django.shortcuts import render

def homepage(request):
    if request.method == 'POST':
        command = request.POST['command']
        command = command.replace("C:\\User\\TypeTest>", "")
        print(command)
    else:
        print('not a post request')
    return render(request, 'homepage.html')