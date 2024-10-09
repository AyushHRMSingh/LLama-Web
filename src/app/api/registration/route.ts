import { NextRequest } from 'next/server';
import { registerResource } from '@/functions/registerResource';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const userdata = await request.json();
    if (userdata) {
      const { email, password, accessToken } = userdata;

      if (email && password && accessToken) {
        const ip = headers().get("x-forwarded-for") || "";
        console.log(email, password, accessToken, request.url);
        const response = await registerResource(email, password, accessToken, ip);
        console.log(response);
        return new Response("Registration successful", { status: 200 });
      } else {
        return new Response("Invalid data provided", { status: 400 });
      }
    } else {
      return new Response("No data provided", { status: 400 });
    }
  } catch (error) {
    console.error("Error parsing JSON");
    return new Response("Invalid JSON", { status: 400 });
  }
}
