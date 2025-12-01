import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";
import "./AuthorProfile.css";

export default function JoinAuthor() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate("/login");
    };
    checkUser();
  }, [navigate]);

  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) setPhotoFile(e.target.files[0]);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrorMsg("You must be logged in.");
      setLoading(false);
      return;
    }

    let photoUrl = "";

    // Upload image if selected
    if (photoFile) {
      try {
        setUploading(true);

        const fileExt = photoFile.name.split(".").pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `${fileName}`; // folder inside bucket

        const { error: uploadError } = await supabase.storage
          .from("avatars") // private bucket
          .upload(filePath, photoFile, { upsert: true });

        if (uploadError) throw uploadError;

        // Generate a public URL to display the avatar
        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        photoUrl = publicUrl;
      } catch (err) {
        setErrorMsg("Failed to upload image: " + err.message);
        setLoading(false);
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    // Insert or update author profile
    try {
      const { error } = await supabase.from("authors").upsert({
        user_id: user.id,
        name: name || user.email,
        bio,
        photo_url: photoUrl,
        created_at: new Date(),
      });

      if (error) {
        setErrorMsg("Failed to save author profile: " + error.message);
        setLoading(false);
        return;
      }

      navigate("/author-profile");
    } catch (err) {
      setErrorMsg("Unexpected error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="author-profile-container">
      <h1>Join as Author</h1>
      {errorMsg && <p className="error">{errorMsg}</p>}

      <form onSubmit={handleJoin} className="join-author-form">
        <label>
          Display Name
          <input
            type="text"
            placeholder="Your author name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label>
          Bio
          <textarea
            placeholder="Tell us about yourself"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>

        <label>
          Profile Photo
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>

        <button type="submit" disabled={loading || uploading}>
          {loading || uploading ? "Joining..." : "Join as Author"}
        </button>
      </form>
    </div>
  );
}
