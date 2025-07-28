import type { APIRoute } from "astro";
import { turso } from "../../lib/turso";

export const GET: APIRoute = async () => {
  try {
    // Realiza una consulta simple para comprobar la conexión
    await turso.execute("SELECT 1;");
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ status: "error", error: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
