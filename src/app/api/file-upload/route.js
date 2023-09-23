//@ts-nocheck
import { authOptions } from "@/lib/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";

const client = new S3Client({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "us-east-1",
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    const data = await req.formData();
    const file = data.get("file");

    if (!session.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (!file) {
      return new Response("File not found", { status: 400 });
    }

    const key = `${session.user.id}.pdf`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
    });

    try {
      const data = await client.send(command);
    } catch (err) {
      console.error("Error uploading file: ", err);
    }

    const fileUrl = `s3://${process.env.AWS_BUCKET_NAME}/${key}`;

    return new Response({ fileUrl });
  } catch (error) {
    console.error(error);
    return new Response("Error uploading file", {
      status: 500,
    });
  }
}
