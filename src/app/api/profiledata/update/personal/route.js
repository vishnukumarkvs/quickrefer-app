import { authOptions } from "@/lib/auth";
import driver from "@/lib/neo4jClient";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const usession = await getServerSession(authOptions);
  const { fullname, phone, address } = await req.json();
  console.log("update profile api route", fullname, phone, address);

  try {
    const neo4jSession = driver.session({ database: "neo4j" });
    let query = "MATCH (u:User {userId: $userId}) SET ";
    const updateClauses = [];

    if (fullname != "") {
      updateClauses.push("u.fullname = $fullname");
    }

    if (phone != "") {
      updateClauses.push("u.phone = $phone");
    }

    if (address != "") {
      updateClauses.push("u.address = $address");
    }

    query += updateClauses.join(", ");

    console.log("query", query);

    const writeResult = await neo4jSession.executeWrite((tx) =>
      tx.run(query, {
        userId: usession.user.id,
        fullname: fullname,
        phone: phone,
        address: address,
      })
    );

    console.log("writeResult", writeResult);

    return new Response(JSON.stringify("Update Successful"), { status: 200 });
  } catch (e) {
    console.log(e);
    return new Response(
      "Internal Server Error, Not able to update user profile data",
      { status: 500 }
    );
  }
}
