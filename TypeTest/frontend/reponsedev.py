def responseDeveloper(array):
    n = "&nbsp;"
    response = ""
    for index, string in enumerate(array):
        if(index >= 1):
            response = response + "<br>" + string
        else:
            response += string
    return response.replace("  ",n+n)