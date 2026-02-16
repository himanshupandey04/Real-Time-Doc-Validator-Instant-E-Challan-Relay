import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';


// Categorized Image Fallbacks for better relevance
// Curated Real-World High-Quality Photography for Traffic & Infrastructure
const CATEGORY_IMAGES = {
    accident: [
        "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1000&q=80", // Damaged car on road
        "https://images.unsplash.com/photo-1518599806-608ce2eb67e0?w=1000&q=80", // Warning signs
        "https://images.unsplash.com/photo-1565514020176-db9318536cc0?w=1000&q=80"  // Emergency lights
    ],
    police: [
        "https://images.unsplash.com/photo-1597167640723-9333550ce022?w=1000&q=80", // Police vehicle on highway
        "https://images.unsplash.com/photo-1626244199577-8d070b433363?w=1000&q=80", // Enforcement officers
        "https://images.unsplash.com/photo-1549480112-88746c07248c?w=1000&q=80"  // Patrol car
    ],
    highway: [
        "https://images.unsplash.com/photo-1473163928189-39445f47a61a?w=1000&q=80", // Modern infrastructure
        "https://images.unsplash.com/photo-1598555620959-1e3df8d3b50c?w=1000&q=80", // Long stretches of road
        "https://images.unsplash.com/photo-1545459720-aac1e5b20574?w=1000&q=80"  // Highway aerial view
    ],
    traffic: [
        "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1000&q=80", // Indian city traffic
        "https://images.unsplash.com/photo-1566611914066-aef93e0bd6ad?w=1000&q=80", // Busy intersection
        "https://images.unsplash.com/photo-1557223566-ffc86c1f541f?w=1000&q=80"  // Night city lights
    ],
    vehicle: [
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&q=80", // Clean car
        "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1000&q=80", // Car interior
        "https://images.unsplash.com/photo-1503376763036-066120622c74?w=1000&q=80"  // Moving vehicle
    ],
    generic: [
        "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1000&q=80", // Person driving
        "https://images.unsplash.com/photo-1555375466-410a8c2d5d85?w=1000&q=80", // Surveillance camera
        "https://images.unsplash.com/photo-1585250002930-b3857db71510?w=1000&q=80"  // Traffic signal
    ]
};

const getFallbackImage = (title) => {
    const t = title.toLowerCase();
    let pool = CATEGORY_IMAGES.generic;

    if (t.includes('accident') || t.includes('crash') || t.includes('collision') || t.includes('hit')) pool = CATEGORY_IMAGES.accident;
    else if (t.includes('police') || t.includes('cop') || t.includes('fine') || t.includes('challan')) pool = CATEGORY_IMAGES.police;
    else if (t.includes('highway') || t.includes('expressway') || t.includes('road')) pool = CATEGORY_IMAGES.highway;
    else if (t.includes('traffic') || t.includes('jam') || t.includes('congestion')) pool = CATEGORY_IMAGES.traffic;
    else if (t.includes('car') || t.includes('bike') || t.includes('truck') || t.includes('vehicle')) pool = CATEGORY_IMAGES.vehicle;

    // Use a simple hash of the title to consistently pick the same image from the pool for the same news
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % pool.length;
    return pool[index];
};

const NewsPage = () => {
    const [newsItems, setNewsItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNews, setSelectedNews] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                // EXCLUSIVE NEWS FEED - Verified High-Quality Realistic Assets
                const exclusiveNews = [
                    {
                        source: "Times of India",
                        title: "AI cameras bring down traffic violations on B'luru-Mys National Highway",
                        pubDate: "Feb 10, 2026",
                        link: "https://timesofindia.indiatimes.com/city/mysuru/ai-cameras-bring-down-traffic-violations-on-bluru-mys-national-highway/articleshow/127915410.cms",
                        summary: "Analysis of the Bengaluru-Mysuru highway shows that while ITMS cameras have significantly reduced violations, vehicle owners still owe the police over Rs 121 crore in unpaid fines.",
                        image: "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=1200&q=80", // Real High-Tech Control Center
                        isVideo: false
                    },
                    {
                        source: "The Hindu",
                        title: "25 ITMS cameras capturing traffic violations on Mysuru-Bengaluru highway",
                        pubDate: "Feb 12, 2026",
                        link: "https://www.thehindu.com/news/national/karnataka/25-itms-cameras-capturing-traffic-violations-on-mysuru-bengaluru-highway/article70594684.ece",
                        summary: "Despite 25 cameras actively monitoring offenses such as speeding and wrong-way driving, more than 90% of the penalties imposed on motorists on this key highway remain unpaid.",
                        image: "https://images.unsplash.com/photo-1598555620959-1e3df8d3b50c?w=1200&q=80", // Professional Highway Photography
                        isVideo: true
                    },
                    {
                        source: "Hindustan Times",
                        title: "Delhi: Cops seek nod for AI traffic management plan",
                        pubDate: "Feb 08, 2026",
                        link: "https://www.hindustantimes.com/cities/delhi-news/delhi-cops-seek-nod-for-ai-traffic-management-plan-101770747888564.html",
                        summary: "The Delhi Police has proposed an AI-enabled Integrated Traffic Management System (ITMS) to ease congestion and travel time. The project involves a phased rollout of adaptive signals and ANPR points.",
                        image: "https://images.unsplash.com/photo-1542362567-b051c63b97c2?w=1200&q=80", // Realistic Traffic Signal/City
                        isVideo: false
                    },
                    {
                        source: "The Economic Times",
                        title: "Delhi drivers, AI is coming to 1000+ traffic signals to auto-generate fines",
                        pubDate: "Feb 05, 2026",
                        link: "https://m.economictimes.com/news/new-updates/delhi-drivers-ai-is-coming-to-1000-traffic-signals-to-auto-generate-fines-heres-why-2026-could-mean-more-challans/articleshow/128193091.cms",
                        summary: "Delhi's upcoming ITMS framework will feature 1000+ smart signals and ANPR cameras. The system will automatically detect violations and generate challans to improve road discipline in 2026.",
                        image: "https://images.unsplash.com/photo-1597167640723-9333550ce022?w=1200&q=80", // Real Enforcement/Police Context
                        isVideo: false
                    },
                    {
                        source: "NDTV News",
                        title: "New Traffic Rule: 5 Violations In A Year Can Cost You Your Licence",
                        pubDate: "Jan 28, 2026",
                        link: "https://www.ndtv.com/india-news/new-traffic-rule-5-violations-in-a-year-can-cost-you-your-licence-10827582",
                        summary: "A strict new rule effective from 2026 targets repeat offenders. Drivers accumulating 5 or more violations within a year—including no helmet or speeding—will face license suspension.",
                        image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1200&q=80", // Realistic Vehicle Close-up
                        isVideo: false
                    },
                    {
                        source: "The Hindu",
                        title: "Rebate scheme for traffic fines in Karnataka swells revenue, at cost of road safety",
                        pubDate: "Jan 20, 2026",
                        link: "https://www.thehindu.com/news/cities/bangalore/rebate-scheme-for-traffic-fines-in-karnataka-swells-revenue-at-cost-of-road-safety/article70529936.ece",
                        summary: "While the fine rebate scheme has broken revenue records for the Karnataka government, experts warn that such incentives might embolden violators and compromise overall road safety standards.",
                        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200&q=80", // Real High-Density Indian Traffic
                        isVideo: false
                    },
                    {
                        source: "Times of India",
                        title: "New rule: 5 or more traffic offences in a year, you may be barred from driving",
                        pubDate: "Jan 15, 2026",
                        link: "https://timesofindia.indiatimes.com/india/5-traffic-offences-in-a-year-could-bar-you-from-driving/articleshow/127055072.cms",
                        summary: "The Ministry has proposed amendments to Motor Vehicle Rules for the disqualification of driving licenses of persistent offenders. Tracking systems are being integrated with national databases.",
                        image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&q=80", // Realistic Driver Perspective
                        isVideo: false
                    }
                ];

                setNewsItems(exclusiveNews);

            } catch (error) {
                console.error("News setup failed", error);
                setNewsItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handleImageError = (newsItemToRemove) => {
        setNewsItems((prevItems) => prevItems.filter((item) => item !== newsItemToRemove));
    };

    const openSummary = (news) => {
        setSelectedNews(news);
    };

    const closeSummary = () => {
        setSelectedNews(null);
    };

    return (
        <div className="news-page">

            <Header />

            <div className="news-container">
                <div className="header-section">
                    <h1 className="page-title">Road & Traffic <span className="highlight">News</span></h1>
                    <div className="status-badge">
                        <span className="status-dot live"></span>
                        LIVE WEEKLY FEED
                    </div>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="loader"></div>
                        <p>Loading latest updates...</p>
                    </div>
                ) : (
                    <div className="news-grid">
                        {newsItems.length > 0 ? (
                            newsItems.map((news, index) => (
                                <div key={news.link || index} className="news-card" onClick={() => openSummary(news)}>
                                    <div className="news-image-wrapper">
                                        <img
                                            src={news.image}
                                            alt={news.title}
                                            className="news-image"
                                            onError={() => handleImageError(news)}
                                        />
                                        <div className="news-credit-badge">Credit: {news.source}</div>
                                        {news.isVideo && <div className="video-badge">▶ Video</div>}
                                    </div>
                                    <div className="news-content">
                                        <div className="news-info">
                                            <span>{new Date(news.pubDate).toLocaleDateString()}</span>
                                            <span className="bullet">•</span>
                                            <span style={{ color: '#F5821F' }}>{news.source}</span>
                                        </div>
                                        <h3>{news.title}</h3>
                                        <button className="read-summary-btn" onClick={(e) => { e.stopPropagation(); openSummary(news); }}>
                                            Read Summary
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-news-container">
                                <p>No recent news found. Check back later.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedNews && (
                <div className="modal-overlay" onClick={closeSummary}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeSummary}>&times;</button>

                        <div className="modal-body-layout">
                            <div className="modal-image-column">
                                <img
                                    src={selectedNews.image}
                                    alt="News"
                                    onError={(e) => e.target.src = getFallbackImage(selectedNews.title)}
                                />
                            </div>
                            <div className="modal-text-column">
                                <span className="modal-source-label">Credit: {selectedNews.source}</span>
                                <h2>{selectedNews.title}</h2>
                                <span className="modal-date">{new Date(selectedNews.pubDate).toLocaleString()}</span>

                                <div className="modal-summary-section">
                                    <h4>Brief Summary</h4>
                                    <p>{selectedNews.summary}</p>
                                </div>
                                <a href={selectedNews.link} target="_blank" rel="noopener noreferrer" className="read-full-btn">
                                    Read Full Article on {selectedNews.source}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />

            <style>{`
                .news-page {
                    min-height: 100vh;
                    background-color: #0d0d12;
                    color: white;
                    font-family: 'Inter', sans-serif;
                }
                .news-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 120px 20px 60px;
                }
                .header-section {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .page-title {
                    font-size: 3rem;
                    font-weight: 800;
                    margin-bottom: 10px;
                }
                .highlight { color: #F5821F; }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    background: rgba(245, 130, 31, 0.1);
                    color: #F5821F;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 1px;
                }
                .status-dot.live {
                    width: 8px;
                    height: 8px;
                    background-color: #F5821F;
                    border-radius: 50%;
                    margin-right: 8px;
                    animation: pulse 1.5s infinite;
                }

                .news-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 30px;
                }
                .news-card {
                    background: #15151a;
                    border-radius: 12px;
                    overflow: hidden;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                }
                .news-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .news-image-wrapper {
                    height: 180px;
                    position: relative;
                }
                .news-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .news-credit-badge {
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    background: rgba(0,0,0,0.7);
                    color: #ccc;
                    font-size: 0.65rem;
                    padding: 2px 6px;
                    border-radius: 4px;
                }
                .video-badge {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    background: #E50914;
                    color: white;
                    padding: 2px 8px;
                    font-size: 0.7rem;
                    border-radius: 3px;
                    font-weight: bold;
                }
                .news-content {
                    padding: 20px;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                .news-info {
                    font-size: 0.75rem;
                    color: #8892b0;
                    margin-bottom: 10px;
                }
                .bullet { margin: 0 5px; }
                .news-content h3 {
                    font-size: 1.1rem;
                    margin: 0 0 15px;
                    line-height: 1.4;
                    color: #fff;
                }
                .read-summary-btn {
                    margin-top: auto;
                    background: transparent;
                    border: 1px solid #aaa;
                    color: #ccc;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    align-self: flex-start;
                    transition: all 0.2s;
                }
                .read-summary-btn:hover {
                    border-color: #F5821F;
                    color: #F5821F;
                }

                /* Modal Styling */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.85);
                    backdrop-filter: blur(5px);
                    z-index: 2000;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                    animation: fadeIn 0.3s ease-out;
                    opacity: 1;
                }
                .modal-content {
                    background: #1a1a20;
                    width: 100%;
                    max-width: 650px;
                    border-radius: 12px;
                    position: relative;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                    animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    flex-direction: column;
                    max-height: 90vh;
                }
                .close-btn {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(0,0,0,0.5);
                    border: none;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    transition: background 0.2s;
                }
                .close-btn:hover { background: rgba(245, 130, 31, 0.8); }

                .modal-body-layout {
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                }
                .modal-image-column {
                    height: 220px;
                    width: 100%;
                    position: relative;
                }
                .modal-image-column img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .modal-text-column {
                    padding: 25px;
                }
                .modal-source-label {
                    color: #F5821F;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    display: block;
                    margin-bottom: 8px;
                }
                .modal-text-column h2 {
                    font-size: 1.4rem;
                    margin: 0 0 8px;
                    line-height: 1.3;
                    color: white;
                }
                .modal-date {
                    font-size: 0.8rem;
                    color: #8892b0;
                    display: block;
                    margin-bottom: 20px;
                }
                .modal-summary-section {
                    margin-bottom: 25px;
                    background: rgba(255,255,255,0.03);
                    padding: 15px;
                    border-radius: 8px;
                    border-left: 3px solid #F5821F;
                }
                .modal-summary-section h4 {
                    margin: 0 0 8px;
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    color: #aaa;
                    letter-spacing: 0.5px;
                }
                .modal-summary-section p {
                    font-size: 0.95rem;
                    line-height: 1.6;
                    color: #ddd;
                    margin: 0;
                }
                .read-full-btn {
                    display: block;
                    width: 100%;
                    padding: 14px;
                    background: white;
                    color: black;
                    text-align: center;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: 700;
                    transition: transform 0.2s;
                }
                .read-full-btn:hover {
                    transform: translateY(-2px);
                    background: #f0f0f0;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.9) translateY(20px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
                
                @media (max-width: 600px) {
                    .page-title { font-size: 2.2rem; }
                    .modal-content { max-height: 95vh; margin: 10px; width: calc(100% - 20px); }
                }
            `}</style>
        </div>
    );
};

export default NewsPage;
