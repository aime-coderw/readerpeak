import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <h2><span>Reader</span><span>Peak</span></h2>
          <p>Empowering readers with amazing stories and books.</p>
        </div>

        <div className="footer-right">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com/aime.nilo" target="_blank" rel="noreferrer">
              <Facebook size={24} />
            </a>
            <a href="https://twitter.com/aimenilo" target="_blank" rel="noreferrer">
              <Twitter size={24} />
            </a>
            <a href="https://instagram.com/aimenilo" target="_blank" rel="noreferrer">
              <Instagram size={24} />
            </a>
            <a href="https://linkedin.com/aimenilo" target="_blank" rel="noreferrer">
              <Linkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="mb-2">© {new Date().getFullYear()} ReaderPeak. All rights reserved.</p>
      </div>
    </footer>
  );
}
