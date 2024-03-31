import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const jwtSecret = new TextEncoder().encode("Optix 3749");

type payload = {
  [key: string]: string;
};
async function encrypt(payload: payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1 week")
    .setIssuer("OptixToolkit Backend")
    .sign(jwtSecret);
}

async function decrypt(jwt: string) {
  try {
    return (
      await jwtVerify(jwt, jwtSecret, {
        algorithms: ["HS256"]
      })
    ).payload;
  } catch (err) {
    console.warn(err);

    return {};
  }
}

export function getSession() {
  return cookies().get("session");
}

export function createSession() {
  encrypt({
    sessionCreation: `${Date.now()}`
  }).then((jwt) => {
    console.log(jwt);

    cookies().set("session", jwt);
  });
}

export async function removeSession() {
  'use server'


  return cookies().delete("session");
}

export async function validateSession() {
  const session = getSession();
  if (!session) return false;

  const jwtExp = (await decrypt(session.value)).exp;
  if (!jwtExp) return false;

  if (Date.now() > jwtExp) return true;
}
