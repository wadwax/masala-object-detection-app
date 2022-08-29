import { error, json } from "@sveltejs/kit";
import { getRequestStatus } from "../../../lib/masala";

export async function POST({ request }) {
  const { requestId, credentials } = await request.json();

  try {
    const response = await getRequestStatus(requestId, credentials);
    return json(response.data);
  } catch (e) {
    throw error(e.status || 500, e.message || e.toString);
  }
}
