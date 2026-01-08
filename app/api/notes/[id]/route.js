import connectMongoDB from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  const { id } = await params;
  const { title, content } = await req.json();
  await connectMongoDB();
  await Note.findByIdAndUpdate(id, { title, content });
  return NextResponse.json({ message: "Note updated" });
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    console.log('Attempting to delete note with ID:', id);
    
    if (!id) {
      console.error('No ID provided for deletion');
      return NextResponse.json({ message: "No ID provided" }, { status: 400 });
    }
    
   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error('Invalid ID format for deletion:', id);
      return NextResponse.json({ message: "Invalid ID format" }, { status: 400 });
    }
    
    await connectMongoDB();
    console.log('Connected to MongoDB');
    
    const deletedNote = await Note.findByIdAndDelete(id);
    console.log('Delete operation result:', deletedNote);
    
    if (!deletedNote) {
      console.log('Note not found for deletion');
      return NextResponse.json({ message: "Note not found" }, { status: 404 });
    }
    
    console.log('Note successfully deleted');
    return NextResponse.json({ message: "Note deleted" });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ message: "Error deleting note" }, { status: 500 });
  }
}
