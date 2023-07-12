import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const { fullname, phone, address } = await req.json();

  try {
    const neo4jSession = driver.session({ database: "neo4j" });
    const query = `
        MATCH (u:User {userId: $userId})
        SET u.fullname = $fullname, u.phone = $phone, u.address = $address 
    `;
    const writeResult = await neo4jSession.executeWrite((tx) =>
      tx.run(query, {
        userId: session.user.id,
        fullname: fullname,
        phone: phone,
        address: address,
      })
    );

    await neo4jSession.close();
    return new Response({ status: 201 });
  } catch (err) {
    console.log(err);
    return new Response(err, { status: 500 });
  }
}
