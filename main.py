import os
import openai
import sys


with open(sys.argv[1] + "\\api_key.txt") as f:
    API_KEY = f.read().strip()
PROMPT = """Throughly yet concisely comment and document the following code, following all conventions of the programming language. Include standard documentation headers and inline comments where appriopriate. Reply only with the new code and comments, and do not change the actual code at all.

{}

Response: 

"""


inputCode = sys.argv[2]
outputCode = ""
try:
    openai.api_key = API_KEY
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=PROMPT.replace("{}", inputCode),
        max_tokens=1024,
        n=1,
        temperature=0.5,
    )
    outputCode = response["choices"][0]["text"]
except:
    outputCode = "ERROR"

print(outputCode, flush=True, end="")
