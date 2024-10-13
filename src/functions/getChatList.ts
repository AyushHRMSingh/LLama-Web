export async function getChatList(addr:string, accessToken:string) {
  // fetch(`http://[${addr}]:2077/`, {
  //   method: 'GET',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     accessToken: accessToken,
  //   })
  // })
  console.log(addr, accessToken);
  await fetch(`http://[${addr}]:2077/`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: accessToken,
    })
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  console.log("wuff")
}