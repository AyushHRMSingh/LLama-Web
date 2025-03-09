export async function createChat(addr:string, accessToken:string, model:string) {
    console.log("getModelList");
    let addra = addr;
    try{
      const result  = await fetch(addra+"/createchat",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: accessToken,
          model: model,
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
        console.log("data progressed2");
        console.log(data);
        return data;
      })
      return result.list;
    } catch (e) {
      console.log("error");
      console.log(e);
      return [[], {
        status: 404,
        message: `${e}`,
      }];
    }
  }