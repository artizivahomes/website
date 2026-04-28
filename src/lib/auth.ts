import { cookies } from "next/headers";

const SECRET_KEY = process.env.ADMIN_JWT_SECRET || "default_secret_change_me_in_env";

// Simple helper for Web Crypto HMAC
async function sign(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const data = encoder.encode(payload);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, data);
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function verify(payload: string, signature: string, secret: string): Promise<boolean> {
  const expectedSignature = await sign(payload, secret);
  return expectedSignature === signature;
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === hash;
}

export async function createAdminSession(userId: string) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    role: "superadmin", 
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 // 24 hours
  }));
  
  const signature = await sign(`${header}.${payload}`, SECRET_KEY);
  const token = `${header}.${payload}.${signature}`;

  const cookieStore = await cookies();
  cookieStore.set("artiziva_admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("artiziva_admin_session")?.value;

  if (!token) return null;

  try {
    const [header, payload, signature] = token.split(".");
    const isValid = await verify(`${header}.${payload}`, signature, SECRET_KEY);
    
    if (!isValid) return null;

    const data = JSON.parse(atob(payload));
    if (data.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return data as { userId: string; role: string };
  } catch (err) {
    return null;
  }
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("artiziva_admin_session");
}
