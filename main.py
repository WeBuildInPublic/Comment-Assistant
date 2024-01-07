import os
import openai
import sys


API_KEY = ""
PROMPT = """Throughly yet concisely comment and document the following code, following all conventions of the programming language. Include standard documentation headers and inline comments where appriopriate. Reply only with the new code and comments, and do not change the actual code at all.

"""


inputCode = sys.argv[1]
outputCode = ""
try:
    openai.api_key = API_KEY
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=PROMPT+inputCode,
        max_tokens=512,
        n=1,
        temperature=0.5,
    )
    outputCode = response["choices"][0]["text"]
except:
    outputCode = "ERROR"

print(outputCode, flush=True, end="")
