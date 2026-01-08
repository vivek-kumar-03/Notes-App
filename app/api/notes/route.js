import connectMongoDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { title, content } = await req.json();
  await connectMongoDB();
  await Note.create({ title, content });
  return NextResponse.json({ message: "Note created" });
}

export async function GET() {
  await connectMongoDB();
  const notes = await Note.find().sort({ createdAt: -1 });
  return NextResponse.json(notes);
}
