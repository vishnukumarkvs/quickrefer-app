import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const { url, company } = await req.json();

  try {
    await axios.post();
    return new Response({ status: 201 });
  } catch (err) {
    console.log(err);
    return new Response(err, { status: 500 });
  }
}
