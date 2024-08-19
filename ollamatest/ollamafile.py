import ollama
import yaml
import os
from dbfile import BackDB

class LLamaChat:
    def __init__(self, connection_string, db_name):
        self.db_obj = BackDB(connection_string, db_name)
        self.db_obj.ModelListRefresh()
        
    def GetAllChats(self):
        return self.db_obj.GetAllChats()
    
    def GetAllModels(self):
        return self.db_obj.GetAllModels()
    
    def GetChatHistory(self, chatid):
        return self.db_obj.GetChatHistory(chatid)
    
    def CreateChat(self, modelname):
        return self.db_obj.CreateChat(modelname)
    
    def RefreshModelList(self):
        self.db_obj.ModelListRefresh()

    def ModelChat(self, chatid, msg):
        chat = self.db_obj.GetChat(chatid)
        model = chat['model_name']
        self.db_obj.AddUser(chatid, msg)
        response = ollama.chat(
            model=model,
            messages=self.db_obj.GetChatHistory(chatid)
        )
        self.db_obj.AddSystem(chatid, response['message']['content'])
        print(response['message']['content'])
        return response['message']['content']
