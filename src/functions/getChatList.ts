export async function getChatList(addr:string, accessToken:string) {
  console.log("getChatList");
  let addra = addr+"/chatlist";
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
      if (response.status == 200) {
        return response.json();
      }
      return [, {
        status: response.status,
      }];
    })
    .then((data) => {
      return data.list;
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