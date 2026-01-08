'use client';

import { useState, useEffect } from 'react';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/notes/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
      setEditingId(null);
    } else {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
    }
    setTitle('');
    setContent('');
    fetchNotes();
  };

  const handleEdit = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note._id);
  };

  const handleDelete = async (id: string) => {
    console.log('Attempting to delete note with ID:', id);
    setNotes(notes.filter(note => note._id !== id));

    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });

      console.log('Delete response status:', res.status);
      
      if (!res.ok) {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } catch (e) {
          
          try {
            errorMessage = await res.text();
          } catch (e2) {
          
            errorMessage = res.statusText || 'Unknown error occurred';
          }
        }
        console.error("Failed to delete:", errorMessage);
       
        fetchNotes();
        alert("Failed to delete note: " + errorMessage);
      } else {
        const responseData = await res.json();
        console.log('Delete response data:', responseData);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      
      fetchNotes();
      alert("Error deleting note");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Notes App</h1>
        <form onSubmit={handleSubmit} className="mb-8">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            required
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 mb-4 border rounded h-32"
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editingId ? 'Update Note' : 'Add Note'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle('');
                setContent('');
              }}
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>
        <div>
          {notes.map((note) => (
            <div key={note._id} className="bg-white p-4 mb-4 rounded shadow">
              <h2 className="text-xl font-semibold">{note.title}</h2>
              <p className="text-gray-700 mb-2">{note.content}</p>
              <p className="text-sm text-gray-500">
                Created: {new Date(note.createdAt).toLocaleString()}
              </p>
              <div className="mt-2">
                <button
                  onClick={() => handleEdit(note)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
