def responseDeveloper(array):
    response = ""
    for index, string in enumerate(array):
        if(index > 1):
            response = response + "<br>" + string
        else:
            response += string
    return response