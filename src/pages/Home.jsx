import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";   // ⬅️ IMPORTANT
import "./Home.css";

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);

  const fetchHomeData = async () => {
    /* -------------------- FEATURED BOOKS -------------------- */
    let { data: featured } = await supabase
  .from("books")
  .select("id, title, cover_url, pdf_url, content")
  .eq("featured", true)
  .limit(10);

// Fallback → load oldest books if no featured
if (!featured || featured.length === 0) {
  const { data: oldestFallback } = await supabase
    .from("books")
    .select("id, title, cover_url, pdf_url, content")
    .order("created_at", { ascending: true }) // earliest first
    .limit(10);

  featured = oldestFallback;
}

setFeaturedBooks(featured);

    /* -------------------- LATEST BOOKS -------------------- */
    const { data: latest, error: latestError } = await supabase
      .from("books")
      .select("id, title, cover_url, pdf_url, content")
      .order("created_at", { ascending: false })
      .limit(10);

    if (!latestError) setLatestStories(latest);

    /* -------------------- TOP BOOKS -------------------- */
    let { data: top } = await supabase
      .from("books")
      .select("id, title, cover_url, pdf_url, content")
      .eq("top", true)
      .limit(10);

    // Fallback → load latest books
    if (!top || top.length === 0) {
      const { data: topFallback } = await supabase
        .from("books")
        .select("id, title, cover_url, pdf_url, content")
        .order("created_at", { ascending: false })
        .limit(10);

      top = topFallback;
    }

    setTopBooks(top);

    /* -------------------- TOP AUTHORS -------------------- */
    const { data: authors, error: authorsError } = await supabase
      .from("authors")
      .select("id, name, photo_url")
      .limit(10);

    if (!authorsError) setTopAuthors(authors);
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <div className="home-container">

      {/* Featured Books */}
      <section className="section featured-books">
        <div className="container">
          <h2><span>Featured</span> <span>Books</span></h2>
          <div className="story-scroll">
            {featuredBooks.map((book) => (
              <div className="story-card" key={book.id}>
                <img src={book.cover_url} alt={book.title} />
                <h3>{book.title}</h3>
                <div className="story-buttons">

                  {/* Read Online */}
                  {book.content && (
                    <Link to={`/story/${book.id}`} className="btn read-btn">
                      Read Now
                    </Link>
                  )}

                  {/* Download PDF */}
                  {book.pdf_url && (
                    <a href={book.pdf_url} className="btn download-btn" target="_blank" rel="noopener noreferrer">
                      Download Book
                    </a>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Books */}
      <section className="section latest-stories">
        <div className="container">
          <h2><span>Latest</span> <span>Books</span></h2>
          <div className="story-scroll">
            {latestStories.map((story) => (
              <div className="story-card" key={story.id}>
                <img src={story.cover_url} alt={story.title} />
                <h3>{story.title}</h3>
                <div className="story-buttons">

                  {story.content && (
                    <Link to={`/story/${story.id}`} className="btn read-btn">
                      Read Now
                    </Link>
                  )}

                  {story.pdf_url && (
                    <a href={story.pdf_url} className="btn download-btn" target="_blank" rel="noopener noreferrer">
                      Download Book
                    </a>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Books */}
      <section className="section top-books">
        <div className="container">
          <h2><span>Top</span> <span>Books</span></h2>
          <div className="story-scroll">
            {topBooks.map((book) => (
              <div className="story-card" key={book.id}>
                <img src={book.cover_url} alt={book.title} />
                <h3>{book.title}</h3>
                <div className="story-buttons">

                  {book.content && (
                    <Link to={`/story/${book.id}`} className="btn read-btn">
                      Read Now
                    </Link>
                  )}

                  {book.pdf_url && (
                    <a href={book.pdf_url} className="btn download-btn" target="_blank" rel="noopener noreferrer">
                      Download Book
                    </a>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Authors */}
      <section className="section top-authors">
        <div className="container">
          <h2><span>Top</span> <span>Authors</span></h2>
          <div className="story-scroll">
            {topAuthors.map((author) => (
              <div className="story-card" key={author.id}>
                {/* Author Photo */}
                <Link to={`/author/${author.id}`}>
                  <img
                    src={author.photo_url || "/default-author.png"}
                    alt={author.name}
                    className="author-photo"
                  />
                </Link>

                {/* Author Name */}
                <h3>
                  <Link to={`/author/${author.id}`} className="author-link">
                    {author.name}
                  </Link>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
