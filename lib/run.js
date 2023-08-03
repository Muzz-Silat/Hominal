const fs = require('fs');
const path = require('path');

function simpleGenerator(numOfWords) {
  const wordsFilePath = path.join(__dirname, '../frontend/data/words-dataset-200.json');
  const wordsData = JSON.parse(fs.readFileSync(wordsFilePath));
  const words = wordsData.words;

  let selectedWords = [];
  for(let i = 0; i < numOfWords; i++){
    selectedWords.push(words[Math.floor(Math.random()*words.length)]);
  }
  const sentence = selectedWords.join(' ');

  return sentence;
}

function run(command) {
  switch (command[1]) {
    case 'typetest':
      if (command.length < 3) {
        return '0x0004' + simpleGenerator(10);
      } else {
        try {
          return '0x0004' + simpleGenerator(parseInt(command[2]));
        } catch {
          return command[2] + ' is not a number';
        }
      }
    case 'snake':
      return '0x0005';
    case 'pong':
      return '0x0006';
    case 'tetris':
      return '0x0007';
    case 'breakout':
      return '0x0008';
    default:
      command.shift();
      return `'${command.join(" ")}' is not a valid run command`;
  }
}

module.exports = run;
