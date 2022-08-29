import { error, json } from "@sveltejs/kit";
import { getRequestId } from "../../../lib/masala";

// Generates and returns request ID
export async function POST({ request }) {
  const credentials = await request.json();

  try {
    const res = await getRequestId(credentials);
    const requestId = res.data.request_id;
    if (!requestId) throw error(500, "Request not created");

    return json({
      requestId,
    });
  } catch (e) {
    throw error(e.status || 500, e.message || e.toString);
  }
}
