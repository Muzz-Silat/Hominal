const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 2000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'frontend')));
app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

// Route for the root URL
app.get('/', (req, res) => {
    const fileName = 'hominal.html';
    const filePath = path.join(__dirname, 'frontend', 'public', fileName);

    // Check if the requested file is within the intended directory
    if (!filePath.startsWith(path.join(__dirname, 'frontend', 'public'))) {
        return res.status(403).send('Forbidden');
    }

    res.sendFile(fileName, { root: path.join(__dirname, 'frontend', 'public') });
});

const responseDev = require("./lib/responseDev")
const run = require("./lib/run")
const help = require("./lib/help")
const tag = require("./lib/tag")

function generateHingi() {
  let hingiArray = [];
  let hingus = [];

  try {
    const hingi = fs.readFileSync('frontend/data/hingus.txt', 'utf-8').split('\n');
    let i = 0;
    while (i < hingi.length - 1) {
      const hingusLen = parseInt(hingi[i].split('##')[2]);
      i += 1;

      for (let j = 0; j < hingusLen; j++) {
        hingus.push(hingi[i + j]);
      }

      hingiArray.push(hingus);
      hingus = []; // Empty the hingus array for the next iteration
      i += hingusLen;
    }
  } catch (err) {
    console.error('Error reading hingus.txt:', err);
  }
  return hingiArray;
}
const hingi = generateHingi();

app.get('/commands/*', (req, res) => {
    const param = req.params;
    let commands = param[0];
    let response = ""

    commands = commands.trim().split(" ");
    switch (commands[0]) {
        case "intro":
            if(commands.length > 1) response = responseDev(initiate)
            else response = responseDev(intro)
        break;

        case "clear":
            if(commands.length > 1){
                if(commands[1] == "-a") response = "0x0001-a";
                else if(commands[1] == "-h") response = "0x0001-h";
            } else response = "0x0001";
        break;

        case "help":
            response = help(commands);
        break;

        case "hingus":
            randHingus = hingi[Math.floor(Math.random()*hingi.length)]
            response = "9x9999"+ "typerate("+randHingus[0]+"*"+randHingus.length+")"+ responseDev(randHingus)
        break;

        case "run":
            response = run(commands);
        break;

        //run current input through search engine, handles through client side
        case "search":
            response = "0x1111"
        break;

        //allow set functionality
        case "set":
            if(commands.length > 1) {commands.shift(); response = "0x2222"+' '.join(commands);}
            else response = commands.shift().join(" ") + "is not a valid set command."
        break;

        case "tag":
            response = tag(commands)
        break;

        //produce empty line on client side
        case "":
            response = "0x0000";
        break;

        default:
            response = `'${param[0]}' is not recognized as an internal or external command, operable program or batch file.`
    }

    res.send(response);
});

intro = [
    "",
    "Getting started:",
    "",
    help([''])+" Type 'help' to see this list of commands when need be.",
    "Press 'tab' to display a list of commands you can type.",
    ""
]

initiate = [
    "Hominal Interactive Nexus, [v1.00-alpha], All Rights Reserved.",
    "A highly interactive, customizable, and utilitarian homepage for your browser.",
    ""
]