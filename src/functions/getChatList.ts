export async function getChatList(addr:string, accessToken:string) {
  console.log("getChatList");
  let addra = addr;
  try{
    const result  = await fetch(addra,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accessToken: accessToken,
      })
    })
    .then((response) => {
      console.log(response);
      console.log(response.status);
      if (response.status == 200) {
        return response.json();
      }
      return [, {
        status: response.status,
      }];
    })
    // .then((response) => response.json())
    .then((data) => {
      console.log("data progressed");
      // if (data.success != true) {
      //   console.log("error");
      //   return null;
      // } else {
      //   console.log("success");
      //   return data.chatList;
      // }
      return data.chatList;
    })
    return [result, {
      status: 200,
    }];
  } catch (e) {
    console.log("error");
    console.log(e);
    return [[], {
      status: 404,
      message: `${e}`,
    }];
  }
}