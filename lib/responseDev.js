function responseDeveloper(array) {
    const n = "&nbsp;";
    let response = "";

    for (let index = 0; index < array.length; index++) {
        if (index >= 1) {
            response = response + "<br>" + array[index];
        } else {
            response += array[index];
        }
    }

    return response.replace(/ {2}/g, n + n);
}

module.exports = responseDeveloper;