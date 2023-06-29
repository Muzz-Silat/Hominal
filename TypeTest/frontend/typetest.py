import random
import json



def simpleGenerator(numOfWords):
    with open("./frontend/data/words-dataset-200.json", "r") as read_file:
        words = json.load(read_file)["words"]
        read_file.close()
    words = random.choices(words, k=numOfWords)
    sentence = ""
    for x in range(words.__len__()):
        sentence += words[x] + " "
    sentence = sentence.strip()
    return sentence
