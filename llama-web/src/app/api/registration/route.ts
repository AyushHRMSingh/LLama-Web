import { NextRequest } from 'next/server';
import { registerResource } from '@/functions/registerResource';
import { headers } from 'next/headers';


export async function POST(request: NextRequest) {
  const userdata = await request.json();
  const { email, password, accessToken } = userdata;
  
  // console.log(email, password, accessToken, request.url);
  // const response = await registerResource(email, password, accessToken, request.headers);
  const response = headers().get("x-forwarded-for");
  console.log(response);

  return new Response("response", { status: 200 });
}