import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/generalNews.css";

const GeneralNews = () => {
  const { i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        const apiKey = "85f8bf7af49640cc9303fbb51c0c492f"; 
        
        /* CLARITY FIX: Namba search query-la 'AND' and 'OR' correctly use panniyachu.
           Ithu "Women" kooda Empowerment illa Safety illa Rights irukira articles-a mattum edukum.
        */
        const query = 'women AND (empowerment OR safety OR "rights" OR "success story" OR health)';
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&language=en&pageSize=15&apiKey=${apiKey}`;
        
        const response = await fetch(newsApiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'ok') {
          // Additional logic: Title-la "Women" or "She" or "Her" irukka-nu verify pannurom
          const filteredNews = data.articles.filter(article => {
            const title = article.title?.toLowerCase() || "";
            const desc = article.description?.toLowerCase() || "";
            const isRemoved = title.includes("[removed]");
            
            // Women related content-a-nu oru double check
            const hasWomenKeywords = title.includes("women") || 
                                     title.includes("female") || 
                                     title.includes("girl") || 
                                     title.includes("safety") ||
                                     desc.includes("women");

            return !isRemoved && title.length > 15 && hasWomenKeywords;
          });
          
          setNews(filteredNews);
        } else {
          throw new Error(data.message || 'Failed to fetch news');
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError(err.message);
        
        // Fallback mock data specific to women
        setNews([
          {
            title: "Empowering Rural Women through Digital Literacy",
            description: "A new program aims to bridge the digital divide for women in rural India.",
            url: "#",
            urlToImage: "/assets/images/logo.png",
            publishedAt: new Date().toISOString(),
            source: { name: "Community Focus" }
          },
          {
            title: "Safe Streets Initiative: New App for Women's Safety Launched",
            description: "The application provides real-time tracking and emergency alerts for safer commutes.",
            url: "#",
            urlToImage: "/assets/images/logo.png",
            publishedAt: new Date().toISOString(),
            source: { name: "Safety Tech" }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(i18n.language === 'ta' ? 'ta-IN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="general-news-page">
        <div className="news-loading">
          <div className="loading-spinner"></div>
          <p>{i18n.language === 'ta' ? 'செய்திகள் சேகரிக்கப்படுகின்றன...' : 'Gathering latest women stories...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="general-news-page">
      <div className="news-container">
        <div className="news-header">
          <h1 className="laws-title">
            {i18n.language === 'ta' ? 'பெண்கள் விழிப்புணர்வு செய்திகள்' : 'Women Empowerment News'}
          </h1>
          <p>
            {i18n.language === 'ta' 
              ? 'பெண்கள் பாதுகாப்பு, கல்வி மற்றும் வெற்றிக் கதைகள் பற்றிய நேரடி செய்திகள்'
              : 'Real-time updates on women\'s safety, achievements, and rights worldwide.'}
          </p>
        </div>

        <div className="news-grid">
          {news.map((article, index) => (
            <div key={index} className="news-card">
              <div className="news-image-container">
                <img 
                  src={article.urlToImage || "/assets/images/news-placeholder.jpg"} 
                  alt={article.title}
                  className="news-image"
                  onError={(e) => {
                    e.target.src = "/assets/images/logo.png";
                  }}
                />
                <div className="news-overlay">
                  <span className="news-source">
                    {article.source?.name || 'News Source'}
                  </span>
                </div>
              </div>
              
              <div className="news-content">
                <h3 className="news-title">{article.title}</h3>
                <p className="news-description">
                  {article.description || 'Visit the full article to read the description of this story.'}
                </p>
                <div className="news-meta">
                  <span className="news-date">
                    {formatDate(article.publishedAt)}
                  </span>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    {i18n.language === 'ta' ? 'மேலும் வாசிக்க →' : 'Read More →'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {news.length === 0 && !error && (
          <div className="no-news">
            <p>No specific women-related articles found right now. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneralNews;
