import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./AuthorProfile.css";

export default function AuthorProfile() {
  const [author, setAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [viewerId, setViewerId] = useState(null);
  const [loading, setLoading] = useState(true);

  const { id: authorParamId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);

      // Get logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      setViewerId(user?.id || null);

      let authorData = null;

      // -------------------------------
      // ⭐ CASE 1: Viewing someone else
      // -------------------------------
      if (authorParamId) {
        const { data, error } = await supabase
          .from("authors")
          .select("*")
          .eq("id", authorParamId)
          .single();

        if (error || !data) {
          console.error("Author not found:", error?.message);
          return navigate("/404");
        }

        authorData = data;
      }

      // -------------------------------
      // ⭐ CASE 2: Viewing your own page
      // -------------------------------
      if (!authorParamId) {
        if (!user?.id) {
          return navigate("/login");
        }

        const { data, error } = await supabase
          .from("authors")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error || !data) {
          // ⭐ FIXED: redirect users without author account
          return navigate("/join-author");
        }

        authorData = data;
      }

      setAuthor(authorData);

      // Load all books
      const { data: booksData, error: booksError } = await supabase
        .from("books")
        .select("*")
        .eq("author_id", authorData.user_id)
        .order("created_at", { ascending: false });

      if (booksError) console.error(booksError);

      setBooks(booksData || []);
      setLoading(false);
    };

    loadProfile();
  }, [authorParamId, navigate]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  const isOwner = viewerId && author?.user_id === viewerId;

  return (
    <div className="author-profile-container">
      {/* Header */}
      <div className="author-header">
        {author.photo_url && (
          <img src={author.photo_url} alt={author.name} className="author-avatar" />
        )}
        <h1>{author.name}</h1>
        {author.bio && <p className="author-bio">{author.bio}</p>}
      </div>

      {/* Upload button */}
      {isOwner && (
        <div className="upload-new-book">
          <Link to="/upload" className="btn upload-btn">
            Upload New Book
          </Link>
        </div>
      )}

      <h2>{isOwner ? "My Books" : `Books by ${author.name}`}</h2>

      {/* Books section */}
      {books.length === 0 ? (
        <div className="no-books">
          {isOwner ? (
            <>
              <p>You haven’t uploaded any books yet.</p>
              <Link to="/upload" className="btn upload-btn">
                Upload Your First Book
              </Link>
            </>
          ) : (
            <p>This author hasn't added any books yet.</p>
          )}
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <img
                src={book.cover_url || "/placeholder.jpg"}
                alt={book.title}
              />
              <h3>{book.title}</h3>
              <Link to={`/story/${book.id}`} className="btn read-btn">
                {isOwner ? "View / Edit" : "Read Story"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
