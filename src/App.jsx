import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ReadStory from "./pages/ReadStory";
import BookPage from "./pages/BookPage";
import Navbar from "./components/Navbar";
import Footer from "./pages/Footer";
import Library from "./pages/Library";
import SearchResults from "./SearchResults";
import Logout from "./Logout";
import Profile from "./Profile";
import Settings from "./Settings";
import AuthorProfile from "./AuthorProfile";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import JoinAuthor from "./JoinAuthor";
import UploadBook from "./UploadBook";


export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/author/:id" element={<AuthorProfile />} />
        <Route path="/upload" element={<UploadBook />} />
        <Route path="/join-author" element={<JoinAuthor />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/author-profile" element={<AuthorProfile />} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/categories/:slug" element={<Library />} />
        <Route path="/" element={<Home />} />
        <Route path="/story/:id" element={<ReadStory />} />
        <Route path="/book/:id" element={<BookPage />} />
      </Routes>
      <Footer />
    </>
  );
}
