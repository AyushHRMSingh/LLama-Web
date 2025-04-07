export async function getChatHistory(addr:string, accessToken:string, chatId:string) {
    console.log("chathistory");
    let addra = addr+"/chathistory";
    try{
      const result  = await fetch(addra,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken,
          chatid: chatId,
        })
      })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
        return [, {
          status: response.status,
        }];
      })
      .then((data) => {
        console.log("chathistory");
        console.log(data);
        return data.chathistory;
      })
      return [result];
    } catch (e) {
      console.log("error");
      console.log(e);
      return [[], {
        status: 404,
        message: `${e}`,
      }];
    }
  }