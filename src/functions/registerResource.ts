import { auth, signInUserWithEmailAndPassword, updateResource } from '@/lib/firebase';

export async function registerResource(email:string, password:string, accessToken:string, ip:string) {
  console.log('email:', email);
  console.log('password:',password);
  const response = await signInUserWithEmailAndPassword(email, password);
  console.log('response:', response);
  const user = auth.currentUser?.toJSON();
  console.log('user:', user);
  const resourceDict = {
    "accessToken": accessToken,
    "ip": ip
  }
  await updateResource(JSON.parse(JSON.stringify(resourceDict)), user);
  return [response, user];
}