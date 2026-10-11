const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let msg = `Erreur ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body.detail === "string") {
        msg = body.detail;
      } else if (Array.isArray(body.detail)) {
        // Erreurs de validation FastAPI (422)
        msg = body.detail
          .map((d) => `${d.loc?.slice(-1)[0]} : ${d.msg}`)
          .join(" | ");
      }
    } catch {}
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

export const getProducts = (search = "") =>
  request(`/products${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const getProduct = (id) => request(`/products/${id}`);
export const createProduct = (data) =>
  request("/products", { method: "POST", body: JSON.stringify(data) });
export const updateProduct = (id, data) =>
  request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteProduct = (id) => request(`/products/${id}`, { method: "DELETE" });
