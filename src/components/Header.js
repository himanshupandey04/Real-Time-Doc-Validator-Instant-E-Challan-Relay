import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Professional CSS-in-JS for single file portability
const headerStyles = `
/* GLOBAL FONTS */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@700&display=swap');

.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9999;
    transition: all 0.4s ease;
    font-family: 'Inter', sans-serif;
    background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
}

/* TOP STATE (TRANSPARENT) */
.navbar-top {
    background: transparent;
    padding-top: 10px;
}

/* SCROLLED STATE  */
.navbar-solid {
    background: rgba(0, 0, 0, 0.8); /* Dark semi-transparent background when scrolled */
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 0;
}

.nav-inner {
    max-width: 1200px;
    margin: auto;
    padding: 12px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* LOGO */
.logo-box {
    padding: 0;
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: transform 0.3s;
}
.logo-box:hover {
    transform: scale(1.02);
}

.header-logo-image {
    height: 50px;
    width: auto;
    object-fit: contain;
}

/* MENU */
.menu {
    display: flex;
    gap: 32px;
    font-weight: 500;
    align-items: center;
}

.menu a {
    text-decoration: none;
    position: relative;
    font-size: 15px;
    color: rgba(255, 255, 255, 0.85); /* Slightly muted white for elegance */
    transition: color 0.3s, text-shadow 0.3s;
    letter-spacing: 0.3px;
}

.menu a:hover {
    color: #FFFFFF;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.4);
}

/* Remove the underline effect and replace with glow/color shift */
.menu a::after {
    display: none;
}

.menu-separator {
    color: rgba(255, 255, 255, 0.2);
    font-weight: 300;
    user-select: none;
}

/* DROPDOWN */
.menu-item {
    position: relative;
    padding: 10px 0;
}

.dropdown {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(15px);
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(16px);
    min-width: 200px;
    border-radius: 4px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255,255,255,0.08);
    opacity: 0;
    visibility: hidden;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 999;
    padding: 6px;
    margin-top: 10px;
}

.menu-item:hover .dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
}

.dropdown a {
    display: block;
    padding: 12px 16px;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    font-size: 14px;
    border-radius: 4px;
    transition: background 0.2s, color 0.2s;
}

.dropdown a:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #FFFFFF;
}

.dropdown::before {
    display: none;
}

/* ICONS */
.icon-group {
    display: flex;
    align-items: center;
}
.icon-group>* {
    margin-left: 8px;
}

.icon-btn {
    background: transparent;
    border: 1px solid transparent; 
    cursor: pointer;
    padding: 10px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
}

.icon-btn svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: rgba(255, 255, 255, 0.9);
    stroke-width: 1.5;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke 0.3s;
}

.icon-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
}

.icon-btn:hover svg {
    stroke: #FFFFFF;
}

/* SEARCH ANIMATION */
.search-wrapper {
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 8px;
}

.search-wrapper input {
    width: 0;
    opacity: 0;
    padding: 8px 16px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    outline: none;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    transition: all 0.3s ease;
    transform: scaleX(0);
    transform-origin: right;
}

.search-wrapper.open input {
    width: 240px;
    opacity: 1;
    transform: scaleX(1);
    margin-right: 10px;
}

/* HAMBURGER */
.hamburger {
    display: none;
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    color: #fff;
    padding: 4px;
}

/* MOBILE MENU */
.mobile-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #000;
    transform: translateY(-100%);
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 9000;
    display: flex;
    flex-direction: column;
    padding-top: 80px;
    align-items: center;
}

.mobile-menu.open {
    transform: translateY(0);
}

.mobile-menu a {
    display: block;
    padding: 20px;
    font-size: 24px;
    color: rgba(255,255,255,0.7);
    text-decoration: none;
    font-weight: 300;
    transition: color 0.3s;
}

.mobile-menu a:hover {
    color: #FFF;
}

@media (max-width: 900px) {
    .menu { display: none; }
    .hamburger { display: inline-block; z-index: 9999; position: relative;}
}

@media (max-width: 768px) {
    .nav-inner { padding: 12px 20px; }
    .search-wrapper { display: none; } 
}
/* LIGHT THEME OVERRIDES */
.navbar-light-mode .menu a {
    color: #1e293b;
}
.navbar-light-mode .menu a:hover {
    color: #F5821F;
    text-shadow: none;
}
.navbar-light-mode .menu-separator {
    color: rgba(0, 0, 0, 0.1);
}
.navbar-light-mode .icon-btn svg {
    stroke: #1e293b;
}
.navbar-light-mode .icon-btn:hover {
    background: rgba(0, 0, 0, 0.05);
}
.navbar-light-mode .icon-btn:hover svg {
    stroke: #F5821F;
}
.navbar-light-mode .dropdown {
    background: #ffffff;
    border: 1px solid rgba(0,0,0,0.1);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}
.navbar-light-mode .dropdown a {
    color: #475569;
}
.navbar-light-mode .dropdown a:hover {
    background: #f1f5f9;
    color: #F5821F;
}
.navbar-light-mode.navbar-solid {
    background: rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.navbar-light-mode.navbar-top {
    background: rgba(255, 255, 255, 0.5);
}
`;

const Header = ({ darkTheme = true }) => {
    const { currentUser, openLoginModal } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    const searchRef = useRef(null);

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (searchOpen && searchRef.current) {
            searchRef.current.focus();
        }
    }, [searchOpen]);

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
        }
    };

    return (
        <>
            <style>{headerStyles}</style>
            <header className={`navbar ${scrolled ? "navbar-solid" : "navbar-top"} ${!darkTheme ? "navbar-light-mode" : ""}`}>
                <div className="nav-inner">

                    {/* LOGO */}
                    <a href="/account" className="logo-box">
                        <img
                            src="/assets/ECR_LOGO.svg"
                            alt="ECR Logo"
                            className="header-logo-image"
                        />
                    </a>


                    {/* MENU */}
                    <nav className="menu">
                        <a href="/account">Home</a>
                        <a href="/about-us">About Us</a>
                        <span className="menu-separator">|</span>
                        <div className="menu-item">
                            <a href="#" onClick={(e) => e.preventDefault()}>Resources</a>
                            <div className="dropdown">
                                <a href="/resources/rules">Rules & Regulations</a>
                                <a href="/resources/fines">Fine Structure</a>
                                <a href="/resources/safety">Road Safety</a>
                            </div>
                        </div>

                        <div className="menu-item">
                            <a href="#" onClick={(e) => e.preventDefault()}>Services</a>
                            <div className="dropdown">
                                {currentUser?.isAdmin && <a href="/admin">Admin Dashboard</a>}
                                <a href="/pay-challan">Pay E-Challan</a>
                                <a href="/verify-documents">Vehicle Doc Verification</a>
                            </div>
                        </div>
                    </nav>

                    {/* ICONS */}
                    <div className="icon-group">

                        {/* NOTIFICATIONS */}
                        <button
                            className="icon-btn"
                            aria-label="Notifications"
                            onClick={() => navigate('/news')}
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </button>

                        {/* SEARCH */}
                        <div className={`search-wrapper ${searchOpen ? "open" : ""}`}>
                            <button
                                className={`icon-btn search-icon ${searchOpen ? "hide" : ""}`}
                                onClick={() => setSearchOpen(true)}
                                aria-label="Open search">
                                <svg viewBox="0 0 24 24">
                                    <circle cx="11" cy="11" r="7"></circle>
                                    <line x1="16.65" y1="16.65" x2="21" y2="21"></line>
                                </svg>
                            </button>

                            <input
                                ref={searchRef}
                                type="text"
                                placeholder="Search here..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                                onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                            />
                        </div>

                        {/* ACCOUNT */}
                        {/* If not logged in, show User Icon but open Login Modal on click */}
                        <a
                            href="/profile"
                            className="icon-btn"
                            aria-label="Account"
                            style={{ position: 'relative', zIndex: 100 }}
                            onClick={(e) => {
                                if (!currentUser) {
                                    e.preventDefault();
                                    openLoginModal();
                                }
                            }}
                        >
                            <svg viewBox="0 0 24 24">
                                <circle cx="12" cy="8" r="4"></circle>
                                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"></path>
                            </svg>
                        </a>

                        {/* HAMBURGER */}
                        <button
                            className="hamburger"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            {mobileOpen ? "✖" : "☰"}
                        </button>

                    </div>
                </div>
            </header>

            {/* MOBILE MENU */}
            <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
                {[
                    { label: "Home", path: "/account" },
                    { label: "About Us", path: "/about-us" },
                    { label: "Rules & Regulations", path: "/resources/rules" },
                    { label: "Vehicle Verification", path: "/verify-documents" }
                ].map((item) => (
                    <a key={item.label} href={item.path} onClick={() => setMobileOpen(false)}>
                        {item.label}
                    </a>
                ))}
            </div>
        </>
    );
}

export default Header;
