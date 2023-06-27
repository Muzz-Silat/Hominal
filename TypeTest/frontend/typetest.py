import random
def simpleGenerator(numOfWords):
    f = open('./frontend/data/words-dataset-1000.txt')
    words = f.readlines()
    f.close()
    words = random.choices(words, k=numOfWords)
    sentence = ""
    for x in range(words.__len__()):
        sentence += words[x].replace("\n", " ")
    sentence = sentence.strip()
    return sentence
