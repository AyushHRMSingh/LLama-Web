import { auth, signInUserWithEmailAndPassword, updateResource } from '@/lib/firebase';

export async function registerResource(email:string, password:string, accessToken:string, url:string) {
  const response = await signInUserWithEmailAndPassword(email, password);
  const user = auth.currentUser?.toJSON();
  const resourceDict = {
    "accessToken": accessToken,
    "url": url
  }
  await updateResource(JSON.parse(JSON.stringify(resourceDict)), user);
  return [response, user];
}