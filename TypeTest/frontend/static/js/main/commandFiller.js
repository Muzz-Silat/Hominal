//commandFiller.js
//Adds the functionality of filling terminal commands by pressing 'tab'.
//This file is a requirement for main.js; fatal errors will be encountered if removed or edited incorrectly.
//#############################################################
//BELOW ARE VARIABLES THAT MUST REMAIN GLOBAL

//commands[]
//Each row must contain n number of cols, where n is the number of total elements in the row before.
//For example, row 0 contains 5 elements, row 1 contains 5 cols, where each col may contain multiple elements.
//Row 2 must then contain n cols where n is the sum of all elements in row 1.
//Refer to repo owner for more details.
let commands = [
[["help", "set", "clear", "run", "tag"]],
[["clear", "tag", "run"], ["functionality", "will", "be", "added", "soon"], ["-a", "-h"], ["breakout", "pong", "snake", "tetris", "typetest"], ["-c", "-n"]]
];

//Will store the currently typed command.
let typedCommand = "";

//The command[] traversal coordinates
let commandRow = 0;
let commandCol = 0; //'help tag' = row 1, col 2

let possibleCommands; //Filtered array of possible commands
let userInput; //Filtered array of user's input

//Used to traverse the list of possible commands
let commandIndex = 0;
//#############################################################

//Takes in inputValue as expression, computes the expression by validating parts of it
//against commands[] and forms, keeps track of row and col while doing so to determine
//possibleCommands[] source directory.
let commandDictionary = function (inputValue) {
userInput = inputValue.split(" ");
for (let i = 0; i < userInput.length; i++) {
    userInput[i] = userInput[i].trim();
}
userInput = userInput.filter(str => str != "");

typedCommand = '';

if (userInput.length > 0) {
    commandRow = 0;
    commandCol = 0;
    let commandComplete = false; //Assumed as false unless the first if statement below fails at the last point.
    for (let i = 0; i < userInput.length; i++) {
    console.log("running for:", userInput[i]);
    if (filterCommands(userInput[i]).length == 1 && (inputValue[inputValue.length - 1] == " " || userInput.length - 1 != i)) {
        let currArray = commands[commandRow][commandCol];
        //Compares each element in the row to the current input.
        for (let j = 0; j < currArray.length; j++) {
        if (currArray[j] == userInput[i]) {
            if (commandRow < commands.length - 1) {
            commandCol = j;
            commandRow++;
            j = currArray.length;
            commandComplete = true;
            }
            //Handle array of length 1
            else if (i == userInput.length - 1) {
            commandComplete = false;
            }
        }
        //To find out whether the last command in the string is completed/valid
        else if (i == userInput.length - 1) {
            commandComplete = false;
        }
        }
    } else if (i == userInput.length - 1) {
        commandComplete = false;
    }
    }
    //At this point, we will have traced the user's input to its command string.
    //We can now determine whether this input is valid and where it can go from here.
    //If valid, commandRow will have a value greater than 0.
    if (commandComplete) {
    typedCommand = userInput;
    possibleCommands = commands[commandRow][commandCol];
    for (let i = 0; i < userInput.length; i++) {
        console.log(userInput[i]);
    }
    } else if (!commandComplete) {
    for (let i = 0; i < userInput.length - 1; i++) {
        typedCommand += userInput[i];
    }
    }
    //console.log("row: "+commandRow)
    //console.log("col: "+commandCol)
}
//When tab is pressed but input is empty, meaning that the user wants to see available commands.
else {
    commandCol = 0;
    commandRow = 0;
    possibleCommands = commands[commandRow][commandCol];
}
};

//Runs every time 'tab' is pressed. Will only match if it's the only possibility.
//Alternatively, it will cycle through the list of possible commands if 'shift+tab' is pressed.
let autoFill = function (possibleCommands) {
if (commandIndex > possibleCommands.length - 1) {
    commandIndex = 0;
}
if (possibleCommands.length > 0 && possibleCommands[commandIndex] != ".") {
    input.innerHTML = typedCommand + " " + possibleCommands[commandIndex];
    //Shift tab
    if (commandIndex > possibleCommands.length - 2) {
    commandIndex = 0;
    } else {
    commandIndex++;
    }
    setCarat(input);
}
};

let printPossibleCommands = function () {
let stringPossibleCommands = "";
try {
    for (let str of possibleCommands) {
    stringPossibleCommands += str.replace(".", "") + " ";
    }
} catch (e) {
    stringPossibleCommands = inputValue + "*";
}

//Handles printing of the possible commands to the terminal,
//also prevents printing out the same thing repeatedly.
try {
    console.log(document.getElementsByClassName("line")[document.getElementsByClassName("line").length - 1].innerText, 90, stringPossibleCommands);
    if (document.getElementsByClassName("line")[document.getElementsByClassName("line").length - 1].innerText + " " != stringPossibleCommands) {
    newline.create(tag + input.innerHTML, 0);

    let tempArray = stringPossibleCommands.split(" ");
    tempArray[0] = "<span class='highlight'>" + tempArray[0] + "</span>";
    newline.create(tempArray.join(" "), 0);

    } else {
    let activeCmd = possibleCommands[commandIndex];
    let lineToEdit = document.getElementsByClassName("line")[document.getElementsByClassName("line").length - 1];

    lineToEdit.innerHTML = stringPossibleCommands;
    lineToEdit.innerHTML[lineToEdit.innerHTML.length - 1] = "";

    console.log(lineToEdit.innerHTML);
    console.log(lineToEdit.innerText);

    let tempArray = lineToEdit.innerText.split(" ");
    for (let i = 0; i < tempArray.length; i++) {
        if (tempArray[i] == activeCmd) {
        console.log("working");
        tempArray[i] = "<span class='highlight'>" + activeCmd + "</span>";
        }
    }

    lineToEdit.innerHTML = tempArray.join(" ");
    }
} catch (e) {
    console.log(e);
    newline.create(tag + input.innerHTML, 0);
    newline.create(stringPossibleCommands, 0);
}
};

//Takes in a string and filters commands[] for everything that starts with the string.
let filterCommands = function (string) {
    return commands[commandRow][commandCol].filter(str => str.startsWith(string));
};

//Filters possibleCommands[] based on user input.
let filterer = function () {
let inputValue = convertToPlain(input.innerHTML);
userInput = inputValue.split(" ").filter(str => str != "");
for (let i = 0; i < userInput.length; i++) {
    userInput[i] = userInput[i].trim();
}
userInput = userInput.filter(str => str != "");

possibleCommands = filterCommands(userInput[userInput.length - 1]);
};
