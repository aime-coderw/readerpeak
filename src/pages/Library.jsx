import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Library.css";

export default function Library() {
  const { slug } = useParams();

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch distinct categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("books")
        .select("category")
        .neq("category", null)
        .order("category", { ascending: true });

      if (!error && data) {
        const unique = [...new Set(data.map((b) => b.category))];
        const mapped = unique.map((cat) => ({
          name: cat,
          slug: cat.toLowerCase().replace(/\s+/g, "-"),
        }));
        setCategories(mapped);
      }
    };

    fetchCategories();
  }, []);

  // Detect active category
  useEffect(() => {
    if (!slug || categories.length === 0) return;
    const found = categories.find((cat) => cat.slug === slug);
    setActiveCategory(found);
  }, [slug, categories]);

  // Fetch books for selected category
  useEffect(() => {
    if (!activeCategory) return;

    const fetchBooks = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("category", activeCategory.name)
        .order("created_at", { ascending: false });

      if (!error) setBooks(data);
      setLoading(false);
    };

    fetchBooks();
  }, [activeCategory]);

  return (
    <div className="library-container">
      <h1 className="library-title">Explore the Library</h1>

      {/* Category Tabs */}
      <div className="library-tabs">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/categories/${cat.slug}`}
            className={`tab-btn ${
              activeCategory?.slug === cat.slug ? "active" : ""
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Books */}
      {loading ? (
        <p className="loading-text">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="no-books">No books in this category.</p>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div className="book-card" key={book.id}>
              <img
                src={book.cover_url || "/placeholder.jpg"}
                alt={book.title}
                className="book-cover"
              />

              <h3 className="book-title">{book.title}</h3>

              <div className="book-actions">
               <a href={`/story/${book.id}`} className="btn read-btn">Read Now</a>
                <a
                  href={book.pdf_url || "#"}
                  className="download-btn"
                  download
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
