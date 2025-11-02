export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.NEXT_PUBLIC_GATEWAY_URL ??
  "http://localhost:4000";

export async function api(path: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "omit", // no cookies; keeps CORS simple
  });

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    console.log("[FE] attaching auth", `Bearer ${token.slice(0,20)}...`);
  } else {
    console.log("[FE] no token in localStorage");
  }
  
  // 204 → no content
  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (res.ok) {
    return isJson ? await res.json() : await res.text();
  }

  // read body once for error
  const bodyText = await res.text().catch(() => "");
  // message starts with status for 404 detection
  const msg = `${res.status} ${res.statusText}${bodyText ? ` - ${bodyText}` : ""}`;
  throw new Error(msg);
}
