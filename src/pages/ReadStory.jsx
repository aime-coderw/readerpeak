import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./ReadStory.css"; // We'll add some basic styling

export default function ReadStory() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBook = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("id, title, cover_url, content, pdf_url, author_id, created_at, author:authors(name)")
      .eq("id", id)
      .single();

    if (!error) setBook(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBook();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading story...</p>;
  if (!book) return <p style={{ textAlign: "center" }}>Story not found.</p>;

  return (
    <div className="story-container">
      <div className="story-header">
        <h1>{book.title}</h1>
        {book.author?.name && <p className="author">by {book.author.name}</p>}
        {book.cover_url && <img src={book.cover_url} alt={book.title} className="cover-image" />}
      </div>

      {/* Story content */}
      <div className="story-content">
        {book.content ? (
          book.content.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))
        ) : (
          <p>No story content available.</p>
        )}
      </div>

      {/* PDF download button */}
      {book.pdf_url && (
        <div className="story-download">
          <a href={book.pdf_url} className="btn download-btn" target="_blank" rel="noopener noreferrer">
            Download Full Book
          </a>
        </div>
      )}
    </div>
  );
}
