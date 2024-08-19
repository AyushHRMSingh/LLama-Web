import flask
import json
import os
import yaml
from ollamafile import LLamaChat
import requests

# Find Root Path
PROJECT_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), '.'))
# Load environment variables from env.yml file
with open(os.path.join(PROJECT_PATH+'/env.yml')) as file:
    env = yaml.load(file, Loader=yaml.FullLoader)

app = flask.Flask(__name__)
app.secret_key = 'Some Secret Key'

@app.route('/api/chat', methods=['POST'])
def chat():
    args = flask.request.get_json()
    response = chatobj.ModelChat(args['chatid'], args['msg'])
    return json.dumps({"response":response})

@app.route('/api/modellist', methods=['POST'])
def modellist():
    return json.dumps(chatobj.GetAllModels())

@app.route('/api/chatlist', methods=['POST'])
def chatlist():
    return json.dumps(chatobj.GetAllChats())

@app.route('/api/createchat', methods=['POST'])
def createchat():
    args = flask.request.get_json()
    return json.dumps({"chatid":chatobj.CreateChat(args['modelname'])})


if __name__ == '__main__':
    chatobj = LLamaChat(env['DBVAR']['host'], env['DBVAR']['dbname'])
    app.run(debug=True,port=8089)
