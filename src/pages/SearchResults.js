import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';


const siteContent = [
    { title: "Home", url: "/account", content: "Main dashboard, statistics, services overview." },
    { title: "About Us", url: "/about-us", content: "Learn about our mission, vision, and team." },
    { title: "Traffic Rules & Regulations", url: "/resources/rules", content: "Comprehensive list of traffic rules, fines, and penalties." },
    { title: "Vehicle Document Verification", url: "/verify-documents", content: "Verify vehicle documents like RC, Insurance, PUC validity." },
    { title: "Pay E-Challan", url: "/pay-challan", content: "Pay your traffic fines online securely." },
    { title: "Road Safety Guidelines", url: "/resources/safety", content: "Essential road safety tips for drivers and pedestrians." },
    { title: "Contact Us", url: "/contact", content: "Get in touch with support, feedback form." },
    { title: "User Profile", url: "/profile", content: "Manage your profile, view history." },
    { title: "News & Alerts", url: "/news", content: "Latest traffic updates, news, and notifications." },
];

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (query) {
            const lowerQuery = query.toLowerCase();
            const filtered = siteContent.filter(item =>
                item.title.toLowerCase().includes(lowerQuery) ||
                item.content.toLowerCase().includes(lowerQuery)
            );
            setResults(filtered);
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div className="search-page">

            <Header />

            <div className="search-container">
                <h1 className="search-title">Search Results for "{query}"</h1>

                {results.length > 0 ? (
                    <div className="results-list">
                        {results.map((result, index) => (
                            <div key={index} className="result-item" onClick={() => navigate(result.url)}>
                                <h3>{result.title}</h3>
                                <p>{result.content}</p>
                                <span className="result-url">{window.location.origin}{result.url}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <p>No matches found for "{query}".</p>
                        <p>Try searching for "challan", "rules", "verify", or "profile".</p>
                    </div>
                )}
            </div>

            <Footer />

            <style>{`
                .search-page {
                    min-height: 100vh;
                    background-color: #000;
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                }

                .search-container {
                    flex: 1;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 120px 20px 60px;
                    width: 100%;
                }

                .search-title {
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 30px;
                    border-bottom: 1px solid #333;
                    padding-bottom: 20px;
                }

                .results-list {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .result-item {
                    background: rgba(255, 255, 255, 0.05);
                    padding: 20px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    border: 1px solid transparent;
                }

                .result-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #F5821F;
                }

                .result-item h3 {
                    margin: 0 0 8px;
                    color: #F5821F;
                    font-size: 1.2rem;
                }

                .result-item p {
                    color: #ddd;
                    font-size: 0.95rem;
                    margin: 0 0 10px;
                }

                .result-url {
                    color: #666;
                    font-size: 0.8rem;
                }

                .no-results {
                    text-align: center;
                    color: #888;
                    margin-top: 50px;
                    font-size: 1.1rem;
                }

                @media (max-width: 768px) {
                    .search-container { padding-top: 100px; }
                }
            `}</style>
        </div>
    );
};

export default SearchResults;
