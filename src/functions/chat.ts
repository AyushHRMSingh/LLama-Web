export async function chat(addr:string, accessToken:string, chatId:string,  message:any) {
    console.log("chat");
    let addra = addr+"/chat";
    try{
      const result  = await fetch(addra,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken,
          chatid: chatId,
          message: message,
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
        console.log("gettingchat");
        console.log(data);
        return data.output;
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