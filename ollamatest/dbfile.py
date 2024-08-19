from pymongo import MongoClient

import ollama
import uuid

class BackDB:
    def __init__(self, connection_string,db_name):
        self.uri = connection_string
        self.client = MongoClient(self.uri)
        self.LLamaDB = self.client[db_name]
        self.ModelList = self.LLamaDB["ModelList"]
        self.ChatList = self.LLamaDB["ChatList"]

    def ModelListRefresh(self):
        self.ModelList.drop()
        for i in ollama.list()['models']:
            print(i)
            self.ModelList.insert_one({
                "name" : i["name"],
                "model" : i["model"]
            })
        # print(self.ModelList.find({}))

    def GetAllModels(self):
        return list(self.ModelList.find({},{"_id":0}))

    def CreateChat(self, modelname):
        while True:
            chatid = str(uuid.uuid4())
            results = self.ChatList.count_documents({"chat_id":chatid})
            if (results != 0):
                chatid = str(uuid.uuid4())
                results = self.ChatList.count_documents({"chat_id":chatid})
                print(results)
            else:
                break
        self.ChatList.insert_one({
            "chat_id":chatid,
            "model_name":modelname
        })
        self.LLamaDB.create_collection(chatid)
        return chatid

    def GetAllChats(self):
        chatlist = self.ChatList.find({},{"_id":0})
        return list(chatlist)
    
    def GetChatHistory(self, chatid):
        chat = self.LLamaDB[chatid]
        message_history = chat.find({},{"_id":0})
        return list(message_history)
    
    def AddUser(self, chatid, msg):
        chat = self.LLamaDB[chatid]
        chat.insert_one({
            "role":"user",
            "content":msg
        })

    def AddSystem(self, chatid, msg):
        chat = self.LLamaDB[chatid]
        chat.insert_one({
            "role":"assistant",
            "content":msg
        })

    def GetChat(self, chatid):
        return self.LLamaDB['ChatList'].find_one({"chat_id":chatid},{"_id":0})