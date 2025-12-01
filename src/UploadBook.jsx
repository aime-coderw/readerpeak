import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./AuthorProfile.css";

export default function UploadBook() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const categories = [
  "Fiction",
  "Non-Fiction",
  "Romance",
  "Thriller",
  "Mystery",
  "Sci-Fi",
  "Fantasy",
  "Biography",
  "Faith & Spirituality",
  "Poetry",
  "Other"
];
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate("/login");
    };
    checkUser();
  }, [navigate]);

  const handlePdfChange = (e) => {
    if (e.target.files.length > 0) setPdfFile(e.target.files[0]);
  };

  const handleCoverChange = (e) => {
    if (e.target.files.length > 0) setCoverFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrorMsg("You must be logged in.");
      setLoading(false);
      return;
    }

    if (!pdfFile) {
      setErrorMsg("Please select a PDF file for the book.");
      setLoading(false);
      return;
    }

    try {
      // Upload PDF
      const pdfExt = pdfFile.name.split(".").pop();
      const pdfName = `${user.id}_${Date.now()}.${pdfExt}`;
      const pdfPath = `books/${pdfName}`;

      const { error: pdfError } = await supabase.storage
        .from("books")
        .upload(pdfPath, pdfFile, { upsert: true });

      if (pdfError) throw pdfError;

      const { data: pdfUrlData } = supabase.storage
        .from("books")
        .getPublicUrl(pdfPath);

      let coverUrl = null;
      if (coverFile) {
        const coverExt = coverFile.name.split(".").pop();
        const coverName = `${user.id}_cover_${Date.now()}.${coverExt}`;
        const coverPath = `covers/${coverName}`;

        const { error: coverError } = await supabase.storage
          .from("books")
          .upload(coverPath, coverFile, { upsert: true });
        if (coverError) throw coverError;

        const { data: coverUrlData } = supabase.storage
          .from("books")
          .getPublicUrl(coverPath);
        coverUrl = coverUrlData.publicUrl;
      }

      // Insert into books table
      const { error: dbError } = await supabase.from("books").insert({
        title,
        author_id: user.id,
        pdf_url: pdfUrlData.publicUrl,
        cover_url: coverUrl,
        category,
        summary,
        content,
        tags: tags ? tags.split(",").map((t) => t.trim()) : null,
      });

      if (dbError) throw dbError;

      navigate("/author-profile");
    } catch (err) {
      setErrorMsg("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="author-profile-container">
      <h1>Upload Book</h1>
      {errorMsg && <p className="error">{errorMsg}</p>}

      <form onSubmit={handleUpload} className="join-author-form">
        <label>
          Title
          <input
            type="text"
            placeholder="Book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
  Category
  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    required
  >
    <option value="">Select a category</option>
    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>
</label>

        <label>
          Summary
          <textarea
            placeholder="Book summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>

        <label>
          Content (optional)
          <textarea
            placeholder="Full content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <label>
          Tags (comma separated)
          <input
            type="text"
            placeholder="tag1, tag2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </label>

        <label>
          PDF File
          <input type="file" accept=".pdf,.epub" onChange={handlePdfChange} required />
        </label>

        <label>
          Cover Image (optional)
          <input type="file" accept="image/*" onChange={handleCoverChange} />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload Book"}
        </button>
      </form>
    </div>
  );
}
