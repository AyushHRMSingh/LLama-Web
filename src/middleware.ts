import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// const { admin } = require('firebase-admin/app');


export async function middleware(request: NextRequest) {
  const sessionAuthenticated = request.cookies.get("sessionAuthenticated")?.value;
  if (sessionAuthenticated) {
    console.log("Session active, skipping auth check");
    return NextResponse.next(); // ✅ Skip if session is active
  }
  const token = request.cookies.get("currentuser")?.value;
  console.log("Token found:", token);
  console.log(request.url);

  

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|userimg.svg).*)'], // Excludes static files
};