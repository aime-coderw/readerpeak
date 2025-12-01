import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "./Navbar.css";
import avatarImg from "../assets/av.jpg";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const categoriesRef = useRef();
  const accountRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleCategories = () => setCategoriesOpen(!categoriesOpen);
  const toggleAccount = () => setAccountOpen(!accountOpen);

  // Fetch live search suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .ilike("title", `%${searchQuery}%`)
        .order("created_at", { ascending: false });

      if (!error) {
        setSearchResults(data);
        setShowSuggestions(true);
      }
      setLoading(false);
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate("/search", { state: { query: searchQuery, results: searchResults } });
      setSearchQuery("");
      setShowSuggestions(false);
    }
  };

  // Close dropdowns if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
      if (!event.target.closest(".search-form")) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <h1>
        <span>Reader</span>
        <span>Peak</span>
      </h1>

      {/* Search Form */}
      <form className="search-form" onSubmit={handleSearchSubmit} autoComplete="off">
        <input
          type="text"
          placeholder="Search stories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowSuggestions(true)}
        />
        <button type="submit" className="search-icon">&#128269;</button>

        {/* Live Suggestions Dropdown */}
        {showSuggestions && searchResults.length > 0 && (
          <ul className="search-suggestions">
            {searchResults.slice(0, 5).map((book) => (
              <li key={book.id}>
                <Link
                  to={`/story/${book.id}`}
                  onClick={() => {
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                >
                  {book.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </form>

      <div className={`hamburger ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <nav className={`menu ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
        <Link to="/categories/romance" onClick={() => setIsOpen(false)}>Library</Link>

        {/* Categories Dropdown */}
        <div className="dropdown" ref={categoriesRef} onClick={toggleCategories}>
          <span className="dropdown-title">Categories</span>
          <ul className={`dropdown-menu ${categoriesOpen ? "open" : ""}`}>
            <li><Link to="/categories/drama" onClick={() => setIsOpen(false)}>Drama</Link></li>
            <li><Link to="/categories/romance" onClick={() => setIsOpen(false)}>Romance</Link></li>
            <li><Link to="/categories/mystery" onClick={() => setIsOpen(false)}>Mystery & Thriller</Link></li>
            <li><Link to="/categories/kids" onClick={() => setIsOpen(false)}>Kids Stories</Link></li>
            <li><Link to="/categories/faith" onClick={() => setIsOpen(false)}>Faith & Spiritual</Link></li>
            <li><Link to="/categories/adventure" onClick={() => setIsOpen(false)}>Adventure</Link></li>
            <li><Link to="/categories/education" onClick={() => setIsOpen(false)}>Education</Link></li>
            <li><Link to="/categories/african" onClick={() => setIsOpen(false)}>African Literature</Link></li>
          </ul>
        </div>

        {/* Account Dropdown */}
        <div className="dropdown account-dropdown" ref={accountRef} onClick={toggleAccount}>
          <img src={avatarImg} alt="Account" className="avatar" />
          <ul className={`dropdown-menu ${accountOpen ? "open" : ""}`}>
            <li><Link to="/profile" onClick={() => setIsOpen(false)}>Profile</Link></li>
            <li><Link to="/author-profile" onClick={() => setIsOpen(false)}>Author Profile</Link></li>
            <li><Link to="/settings" onClick={() => setIsOpen(false)}>Settings</Link></li>
            <li><Link to="/logout" onClick={() => setIsOpen(false)}>Logout</Link></li>
          </ul>
        </div>

      </nav>
    </header>
  );
}
