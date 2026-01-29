// src/pages/user/Home.jsx

import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LawCard from "../../components/cards/LawCard";
import SchemeCard from "../../components/cards/SchemeCard";
import ArticleCard from "../../components/cards/ArticleCard";
import Loader from "../../components/common/Loader";

import api from "../../services/api";
import feedbackService from "../../services/feedbackService";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchArticles } from "../../features/articles/articleSlice";
import "../../styles/home.css"; // Custom CSS for animations, layout

const Home = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { articles: reduxArticles, loading: articlesLoading } = useSelector(state => state.articles);
  const [laws, setLaws] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [realCounts, setRealCounts] = useState({ laws: 0, schemes: 0, articles: 0 });
  const [animatedStats, setAnimatedStats] = useState({ laws: 0, schemes: 0, articles: 0 });
  const [isVisible, setIsVisible] = useState({});
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const dataLoadedRef = useRef(false); // Track if data has been loaded
  const retryTimeoutRef = useRef(null); // Track retry timeout

  const MAX_CARDS = 4; // Show 4 cards per section
  const heroSlides = [
    {
      title: "Empowering Women Through Awareness",
      titleTa: "விழிப்புணர்வு மூலம் பெண்களை மேம்படுத்துதல்",
      subtitle: "Know your rights and access resources",
      subtitleTa: "உங்கள் உரிமைகளை அறிந்து வளங்களை அணுகுங்கள்",
      image: "/assets/images/hero1.jpg"
    },
    {
      title: "Know Your Rights, Access Schemes",
      titleTa: "உங்கள் உரிமைகளை அறிந்து, திட்டங்களை அணுகுங்கள்",
      subtitle: "Government initiatives for women empowerment",
      subtitleTa: "பெண்கள் மேம்பாட்டுக்கான அரசு முன்முயற்சிகள்",
      image: "/assets/images/hero2.jpg"
    },
    {
      title: "Join Our Community",
      titleTa: "எங்கள் சமூகத்தில் சேர்ந்து கொள்ளுங்கள்",
      subtitle: "Connect with thousands of empowered women",
      subtitleTa: "ஆயிரக்கணக்கான மேம்படுத்தப்பட்ட பெண்களுடன் இணைக்கவும்",
      image: "/assets/images/hero3.jpg"
    },
    {
      title: "Stand Strong, Stand Together",
      titleTa: "வலுவாக நில்லுங்கள், ஒன்றாக நில்லுங்கள்",
      subtitle: "Building a stronger future for all women",
      subtitleTa: "அனைத்து பெண்களுக்கும் வலுவான எதிர்காலத்தை உருவாக்குதல்",
      image: "/assets/images/hero4.jpg"
    }
  ];

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate stats on mount and when real counts are available
  useEffect(() => {
    if (realCounts.laws === 0 && realCounts.schemes === 0 && realCounts.articles === 0) return;
    
    const animateValue = (start, end, duration, key) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setAnimatedStats(prev => ({
          ...prev,
          [key]: Math.floor(progress * (end - start) + start)
        }));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    animateValue(0, realCounts.laws, 2000, 'laws');
    animateValue(0, realCounts.schemes, 2000, 'schemes');
    animateValue(0, realCounts.articles, 2000, 'articles');
  }, [realCounts]);

  // Fetch articles using Redux like Awareness page
  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  // Update articles state when Redux articles change
  useEffect(() => {
    setArticles(reduxArticles);
    setRealCounts(prev => ({
      ...prev,
      articles: reduxArticles.length
    }));
  }, [reduxArticles]);

  useEffect(() => {
    const fetchData = async () => {
      if (dataLoadedRef.current) return; // Prevent multiple calls
      
      try {
        setLoading(true);

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        const [lawsRes, schemesRes] = await Promise.all([
          api.get("/laws"),
          api.get("/schemes"),
        ]);

        // Extract data from the response structure
        const lawsData = Array.isArray(lawsRes.data?.articles) ? lawsRes.data.articles : (Array.isArray(lawsRes.data?.data) ? lawsRes.data.data : []);
        const schemesData = Array.isArray(schemesRes.data?.articles) ? schemesRes.data.articles : (Array.isArray(schemesRes.data?.data) ? schemesRes.data.data : []);

        setLaws(lawsData);
        setSchemes(schemesData);
        // Articles are handled by Redux useEffect - don't set them here to avoid conflicts
        
        // Set real counts from backend (excluding articles - handled by Redux)
        setRealCounts(prev => ({
          ...prev,
          laws: lawsData.length,
          schemes: schemesData.length
        }));
        
        dataLoadedRef.current = true; // Mark as loaded
      } catch (err) {
        console.error("Error fetching home data:", err);
        
        // Handle rate limiting specifically
        if (err.response?.status === 429) {
          console.log("Rate limited. Retrying in 10 seconds...");
          // Don't mark as loaded so it can retry later
          dataLoadedRef.current = false;
          setLoading(false);
          
          // Clear any existing retry timeout
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          
          // Set up retry
          retryTimeoutRef.current = setTimeout(() => {
            console.log("Retrying data fetch...");
            dataLoadedRef.current = false; // Reset to allow retry
            fetchData();
          }, 10000); // Retry after 10 seconds
          
          return;
        }
        
        // Ensure arrays are set to empty arrays on error
        setLaws([]);
        setSchemes([]);
        // Articles are handled by Redux - don't reset them here
        setRealCounts(prev => ({
          ...prev,
          laws: 0,
          schemes: 0
        })); // Don't reset articles count - handled by Redux
        dataLoadedRef.current = true; // Mark as attempted
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Cleanup retry timeout on unmount
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  const handleFeedbackChange = (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [e.target.name]: e.target.value
    });
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    console.log('Feedback form submission:', {
      isAuthenticated: isAuthenticated,
      user: user,
      form: feedbackForm
    });

    // Check if user is authenticated using localStorage tokens
    const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
    const storedUser = localStorage.getItem('user') || localStorage.getItem('adminUser');
    const isUserAuthenticated = !!(token && storedUser);

    console.log('Authentication check:', {
      token: !!token,
      storedUser: !!storedUser,
      isUserAuthenticated: isUserAuthenticated,
      reduxIsAuthenticated: isAuthenticated,
      reduxUser: user
    });

    // Use localStorage-based authentication check instead of Redux
    if (!isUserAuthenticated) {
      const shouldLogin = window.confirm(
        currentLanguage === 'ta'
          ? 'கருத்து அனுப்புவதற்கு உள்நுழைவு தேவை. உள்நுழைய வேண்டுமா?'
          : 'You need to be logged in to submit feedback. Would you like to login?'
      );

      if (shouldLogin) {
        navigate('/login');
      }
      return;
    }

    setFeedbackSubmitting(true);

    try {
      const result = await feedbackService.submitFeedback(feedbackForm);

      // Reset form
      setFeedbackForm({ name: '', email: '', message: '' });
      alert(currentLanguage === 'ta' ? 'உங்கள் கருத்து வெற்றிகரமாக அனுப்பப்பட்டது!' : 'Your feedback has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert(currentLanguage === 'ta' ? 'கருத்து அனுப்புவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.' : 'Error submitting feedback. Please try again.');
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Remove search functionality - show all items
  const filteredLaws = Array.isArray(laws) ? laws : [];
  const filteredSchemes = Array.isArray(schemes) ? schemes : [];
  const filteredArticles = Array.isArray(articles) ? articles : [];

  if (loading) return <Loader />;

  // Get current language
  const currentLanguage = i18n.language;

  return (
    <div className="home-page page-content">
      {/* Hero Section with Full-Screen Slideshow */}
      <section className="hero-section">
        <div className="hero-slider">
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-overlay">
                <div className="hero-content">
                  <h1 className="hero-title animate-fade-in">
                    {currentLanguage === 'ta' ? slide.titleTa : slide.title}
                  </h1>
                  <p className="hero-subtitle animate-fade-in-delay">
                    {currentLanguage === 'ta' ? slide.subtitleTa : slide.subtitle}
                  </p>
                  <div className="hero-buttons animate-fade-in-delay-2">
                    <Link to="/register" className="hero-btn primary">
                      {currentLanguage === 'ta' ? 'தொடங்குங்கள்' : 'Get Started'}
                    </Link>
                    <Link to="/about" className="hero-btn secondary">
                      {currentLanguage === 'ta' ? 'மேலும் அறிய' : 'Learn More'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => handleSlideChange(index)}
            />
          ))}
        </div>
        {/* Touch Navigation Arrows */}
        <div className="hero-navigation">
          <button 
            className="hero-nav-btn prev"
            onClick={() => handleSlideChange((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button 
            className="hero-nav-btn next"
            onClick={() => handleSlideChange((currentSlide + 1) % heroSlides.length)}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </section>

      {/* Full-Screen Modal for Slideshow */}
      <section className="welcome-section animate-on-scroll" id="welcome">
        <div className="welcome-container">
          <div className="welcome-content">
            <h2>
              {currentLanguage === 'ta' 
                ? 'பெண்கள் விழிப்புணர்வு தளத்திற்கு வரவேற்கிறோம்'
                : 'Welcome to Women Awareness Platform'}
            </h2>
            <p className="welcome-description">
              {currentLanguage === 'ta' 
                ? 'எங்கள் தளம் அறிவு, சட்ட வளங்கள் மற்றும் அரசு திட்டங்களை அணுகுவதன் மூலம் பெண்களை மேம்படுத்துவதற்காக அர்ப்பணிக்கப்பட்டுள்ளது. பெண்களின் உரிமைகள், சட்ட பாதுகாப்புகள் மற்றும் வளர்ச்சி மற்றும் மேம்பாட்டுக்கான வாய்ப்புகள் குறித்த விரிவான தகவல்களை நாங்கள் வழங்குகிறோம்.'
                : 'Our platform is dedicated to empowering women through knowledge, legal resources, and access to government schemes. We provide comprehensive information about women\'s rights, legal protections, and opportunities for growth and development.'}
            </p>
            <div className="welcome-stats">
              <div className="welcome-stat">
                <div className="welcome-stat-number">{animatedStats.laws.toLocaleString()}</div>
                <div className="welcome-stat-label">
                  {currentLanguage === 'ta' ? 'சட்டங்கள் & விதிகள்' : 'Laws & Regulations'}
                </div>
                <div className="welcome-stat-desc">
                  {currentLanguage === 'ta' 
                    ? 'பெண்களின் உரிமைகள் மற்றும் பாதுகாப்புகள் குறித்த விரிவான சட்ட வளங்கள்'
                    : 'Comprehensive legal resources covering women\'s rights and protections'}
                </div>
              </div>
              <div className="welcome-stat">
                <div className="welcome-stat-number">{animatedStats.schemes.toLocaleString()}</div>
                <div className="welcome-stat-label">
                  {currentLanguage === 'ta' ? 'அரசு திட்டங்கள்' : 'Government Schemes'}
                </div>
                <div className="welcome-stat-desc">
                  {currentLanguage === 'ta' 
                    ? 'பெண்கள் மேம்பாட்டுக்கான நிதி உதவி, கல்வி மற்றும் சுகாதார திட்டங்கள்'
                    : 'Financial assistance, education, and healthcare schemes for women empowerment'}
                </div>
              </div>
              <div className="welcome-stat">
                <div className="welcome-stat-number">{animatedStats.articles.toLocaleString()}</div>
                <div className="welcome-stat-label">
                  {currentLanguage === 'ta' ? 'விழிப்புணர்வு கட்டுரைகள்' : 'Awareness Articles'}
                </div>
                <div className="welcome-stat-desc">
                  {currentLanguage === 'ta' 
                    ? 'பெண்கள் சிக்கல்கள், சுகாதாரம் மற்றும் தொழில் மேம்பாடு குறித்த தகவல்கள்'
                    : 'Information on women\'s issues, health, and career development'}
                </div>
              </div>
            </div>
          </div>
          <div className="welcome-images">
            <div className="welcome-image-item">
              <img src="/assets/images/service1.jpg" alt="Service 1" />
              <div className="welcome-image-overlay">
                {currentLanguage === 'ta' ? 'சட்ட ஆதரவு' : 'Legal Support'}
              </div>
            </div>
            <div className="welcome-image-item">
              <img src="/assets/images/service2.jpg" alt="Service 2" />
              <div className="welcome-image-overlay">
                {currentLanguage === 'ta' ? 'அரசு திட்டங்கள்' : 'Government Schemes'}
              </div>
            </div>
            <div className="welcome-image-item">
              <img src="/assets/images/service3.jpg" alt="Service 3" />
              <div className="welcome-image-overlay">
                {currentLanguage === 'ta' ? 'விழிப்புணர்வு நிரல்கள்' : 'Awareness Programs'}
              </div>
            </div>
            <div className="welcome-image-item">
              <img src="/assets/images/service4.jpg" alt="Service 4" />
              <div className="welcome-image-overlay">
                {currentLanguage === 'ta' ? 'சமூக ஆதரவு' : 'Community Support'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section animate-on-scroll" id="stats">
        <div className="section-content-wrapper">
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-number">{animatedStats.laws.toLocaleString()}+</div>
              <div className="stat-label">
                {currentLanguage === 'ta' ? 'சட்டங்கள் & விதிகள்' : 'Laws & Regulations'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{animatedStats.schemes.toLocaleString()}+</div>
              <div className="stat-label">
                {currentLanguage === 'ta' ? 'அரசு திட்டங்கள்' : 'Government Schemes'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{animatedStats.articles.toLocaleString()}+</div>
              <div className="stat-label">
                {currentLanguage === 'ta' ? 'விழிப்புணர்வு கட்டுரைகள்' : 'Awareness Articles'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions-section animate-on-scroll" id="quick-actions">
        <div className="quick-actions-container">
          <h2>
            {currentLanguage === 'ta' ? 'விரைவு செயல்கள்' : 'Quick Actions'}
          </h2>
          <div className="action-cards">
            <Link to="/laws" className="action-card">
              <div className="action-icon">⚖️</div>
              <h3>
                {currentLanguage === 'ta' ? 'சட்டங்களைப் உலாவுங்கள்' : 'Browse Laws'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'பெண்களின் உரிமைகள் மற்றும் சட்ட பாதுகாப்புகளை ஆராயுங்கள்'
                  : 'Explore women\'s rights and legal protections'}
              </p>
            </Link>
            <Link to="/schemes" className="action-card">
              <div className="action-icon">💼</div>
              <h3>
                {currentLanguage === 'ta' ? 'அரசு திட்டங்கள்' : 'Government Schemes'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'பெண்களுக்கான நன்மைகள் மற்றும் முன்முயற்சிகளைக் கண்டறியுங்கள்'
                  : 'Discover benefits and initiatives for women'}
              </p>
            </Link>
            <Link to="/awareness" className="action-card">
              <div className="action-icon">📰</div>
              <h3>
                {currentLanguage === 'ta' ? 'விழிப்புணர்வு கட்டுரைகள்' : 'Awareness Articles'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'பெண்கள் சிக்கல்கள் குறித்த தகவல்தொகுதிகளைப் படிக்கவும்'
                  : 'Read informative content on women\'s issues'}
              </p>
            </Link>
            <Link to="/women-resources" className="action-card">
              <div className="action-icon">📜🤝</div>
              <h3>
                {currentLanguage === 'ta' ? 'பெண்கள் வளங்கள்' : 'Women Resources'}
              </h3>
              <p>
                {currentLanguage === 'ta'
                  ? 'பெண்களுக்கான ஆதரவு வளங்கள் மற்றும் தொடர்பு தகவல்கள்'
                  : 'Support resources and contact information for women'}
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Images Section */}
      <section className="quick-links-section animate-on-scroll" id="quick-links">
        <div className="quick-links-container">
          <h2>
            {currentLanguage === 'ta' ? 'விரைவு இணைப்புகள்' : 'Quick Links'}
          </h2>
          <div className="quick-links-grid">
            <div className="quick-link-item">
              <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Legal Aid" />
              <div className="quick-link-content">
                <h3>
                  {currentLanguage === 'ta' ? 'சட்ட உதவி' : 'Legal Aid'}
                </h3>
                <p>
                  {currentLanguage === 'ta'
                    ? 'இலவச சட்ட ஆலோசனை மற்றும் உதவிக்கான வளங்கள்'
                    : 'Resources for free legal advice and assistance'}
                </p>
              </div>
            </div>
            <div className="quick-link-item">
              <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" alt="Emergency Services" />
              <div className="quick-link-content">
                <h3>
                  {currentLanguage === 'ta' ? 'அவசர சேவைகள்' : 'Emergency Services'}
                </h3>
                <p>
                  {currentLanguage === 'ta'
                    ? 'பாதுகாப்பு மற்றும் பாதுகாப்புக்கான தொடர்பு எண்கள்'
                    : 'Contact numbers for safety and protection'}
                </p>
              </div>
            </div>
            <div className="quick-link-item">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" alt="Support Groups" />
              <div className="quick-link-content">
                <h3>
                  {currentLanguage === 'ta' ? 'ஆதரவு குழுக்கள்' : 'Support Groups'}
                </h3>
                <p>
                  {currentLanguage === 'ta'
                    ? 'பெண்களுக்கான சமூக ஆதரவு மற்றும் வலைப்பின்னல்கள்'
                    : 'Social support and networks for women'}
                </p>
              </div>
            </div>
            <div className="quick-link-item">
              <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1396&q=80" alt="Skill Development" />
              <div className="quick-link-content">
                <h3>
                  {currentLanguage === 'ta' ? 'திறன் மேம்பாடு' : 'Skill Development'}
                </h3>
                <p>
                  {currentLanguage === 'ta'
                    ? 'தொழில் மேம்பாட்டுக்கான பயிற்சி மற்றும் வளங்கள்'
                    : 'Training and resources for career advancement'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Box Section */}
      <section className="content-box-section animate-on-scroll" id="content-boxes">
        <div className="content-boxes-container">
          <div className="content-box">
            <div className="content-box-icon">⚖️</div>
            <h3>
              {currentLanguage === 'ta' ? 'சட்ட உரிமைகள் & பாதுகாப்புகள்' : 'Legal Rights & Protections'}
            </h3>
            <p>
              {currentLanguage === 'ta' 
                ? 'பெண்களின் சட்ட உரிமைகள், குடும்ப வன்முறை சட்டங்கள், பணியிட பாதுகாப்புகள் மற்றும் பலவற்றைப் பற்றிய விரிவான தகவல்கள்.'
                : 'Comprehensive information about women\'s legal rights, domestic violence laws, workplace protections, and more.'}
            </p>
          </div>
          <div className="content-box">
            <div className="content-box-icon">💼</div>
            <h3>
              {currentLanguage === 'ta' ? 'அரசு திட்டங்கள் & நன்மைகள்' : 'Government Schemes & Benefits'}
            </h3>
            <p>
              {currentLanguage === 'ta' 
                ? 'நிதி உதவி, திறன் மேம்பாட்டுத் திட்டங்கள், சுகாதார திட்டங்கள் மற்றும் கல்வி ஆதரவு பற்றிய தகவல்களை அணுகுங்கள்.'
                : 'Access information about financial assistance, skill development programs, healthcare schemes, and educational support.'}
            </p>
          </div>
          <div className="content-box">
            <div className="content-box-icon">📰</div>
            <h3>
              {currentLanguage === 'ta' ? 'விழிப்புணர்வு & கல்வி' : 'Awareness & Education'}
            </h3>
            <p>
              {currentLanguage === 'ta' 
                ? 'பெண்கள் சிக்கல்கள், மேம்பாடு, சுகாதாரம் மற்றும் தொழில் மேம்பாடு குறித்த கட்டுரைகள், செய்திகள் மற்றும் வளங்களைப் படிக்குங்கள்.'
                : 'Stay informed with articles, news, and resources on women\'s issues, empowerment, health, and career development.'}
            </p>
          </div>
        </div>
      </section>

      {/* Laws Section */}
      <section className="section laws-section animate-on-scroll" id="laws">
        <div className="section-header">
          <div className="section-title-wrapper">
            <h2>
              {currentLanguage === 'ta' ? 'முக்கியமான சட்டங்கள்' : 'Important Laws'}
            </h2>
            <span className="section-count-badge">{animatedStats.laws}+</span>
          </div>
          <Link to="/laws" className="see-all-btn">
            {currentLanguage === 'ta' ? 'அனைத்தையும் பார்க்க →' : 'See All →'}
          </Link>
        </div>
        <p className="section-description">
          {currentLanguage === 'ta' 
            ? 'பெண்களின் உரிமைகள் மற்றும் சட்ட பாதுகாப்புகள் குறித்த விரிவான தகவல்களை ஆராயுங்கள். எங்கள் சட்டங்கள் பிரிவு குடும்ப வன்முறை, பணியிட உரிமைகள், சொத்துரிமை மற்றும் பெண்களின் நலன்களைப் பாதுகாத்து நீதியை உறுதிப்படுத்த வடிவமைக்கப்பட்ட பிற அத்தியாவசிய சட்ட பாதுகாப்புகளை உள்ளடக்கியது.'
            : 'Explore comprehensive information about women\'s rights and legal protections. Our laws section covers domestic violence, workplace rights, property rights, and other essential legal protections designed to safeguard women\'s interests and ensure justice.'}
        </p>
        <div className="section-image-containers">
          <div className="section-image-item">
            <img src="/assets/images/law-icon.jpg" alt="Law 1" />
            <div className="section-image-content">
              <h3>
                {currentLanguage === 'ta' ? 'குடும்ப வன்முறை சட்டங்கள்' : 'Domestic Violence Laws'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'சட்ட தீர்வுகள் மற்றும் ஆதரவு அமைப்புகளுடன் குடும்ப வன்முறை மற்றும் துஷ்பிரயோகத்திலிருந்து பாதுகாப்பு.'
                  : 'Protection against domestic violence and abuse with legal remedies and support systems.'}
              </p>
            </div>
          </div>
          <div className="section-image-item">
            <img src="/assets/images/law-icon2.jpg" alt="Law 2" />
            <div className="section-image-content">
              <h3>
                {currentLanguage === 'ta' ? 'பணியிட உரிமைகள்' : 'Workplace Rights'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'சம வாய்ப்புகள், ஊதிய சமத்துவம் மற்றும் பணியிட துன்புறுத்தல் மற்றும் பாகுபாட்டிலிருந்து பாதுகாப்பு.'
                  : 'Equal opportunities, pay parity, and protection from workplace harassment and discrimination.'}
              </p>
            </div>
          </div>
          <div className="section-image-item">
            <img src="/assets/images/law-icon3.jpg" alt="Law 3" />
            <div className="section-image-content">
              <h3>
                {currentLanguage === 'ta' ? 'சொத்து & வாரிசுரிமை' : 'Property & Inheritance'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'சட்டத்தின் கீழ் பெண்களின் சொத்து, வாரிசுரிமை மற்றும் நிதி சுதந்திர உரிமைகள்.'
                  : 'Women\'s rights to property, inheritance, and financial independence under the law.'}
              </p>
            </div>
          </div>
        </div>
        <div className="cards-container">
          {filteredLaws.slice(0, MAX_CARDS).map((law, index) => (
            <div 
              key={law._id} 
              className="card-wrapper animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <LawCard law={law} />
            </div>
          ))}
        </div>
        {filteredLaws.length === 0 && (
          <div className="no-results">
            <p>No laws found matching your search.</p>
          </div>
        )}
      </section>

      {/* Schemes Section */}
      <section className="section schemes-section animate-on-scroll" id="schemes">
        <div className="section-header">
          <div className="section-title-wrapper">
            <h2>
              {currentLanguage === 'ta' ? 'அரசு திட்டங்கள்' : 'Government Schemes'}
            </h2>
            <span className="section-count-badge">{animatedStats.schemes}+</span>
          </div>
          <Link to="/schemes" className="see-all-btn">
            {currentLanguage === 'ta' ? 'அனைத்தையும் பார்க்க →' : 'See All →'}
          </Link>
        </div>
        <p className="section-description">
          {currentLanguage === 'ta' 
            ? 'நிதியியல், கல்வி மற்றும் சமூக ரீதியாக பெண்களை மேம்படுத்துவதற்காக வடிவமைக்கப்பட்ட பல்வேறு அரசு திட்டங்கள் மற்றும் நிரல்களைக் கண்டறியுங்கள். நிதி உதவி மற்றும் திறன் மேம்பாட்டிலிருந்து சுகாதாரம் மற்றும் வீடு கட்டும் திட்டங்கள் வரை, உங்கள் வாழ்க்கையை மாற்றக்கூடிய வாய்ப்புகளைக் கண்டறியுங்கள்.'
            : 'Discover various government schemes and programs designed to empower women financially, educationally, and socially. From financial assistance and skill development to healthcare and housing schemes, find opportunities that can transform your life.'}
        </p>
        <div className="section-image-containers">
          <div className="section-image-item">
            <img src="/assets/images/scheme-icon.jpg" alt="Scheme 1" />
            <div className="section-image-content">
              <h3>
                {currentLanguage === 'ta' ? 'நிதி உதவி' : 'Financial Assistance'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'பெண் தொழில்முனைவோர் மற்றும் சிறு வணிகங்களுக்கான கடன்கள், மானியங்கள் மற்றும் உதவித்தொகைகள்.'
                  : 'Loans, grants, and subsidies for women entrepreneurs and small businesses.'}
              </p>
            </div>
          </div>
          <div className="section-image-item">
            <img src="/assets/images/scheme-icon2.jpg" alt="Scheme 2" />
            <div className="section-image-content">
              <h3>
                {currentLanguage === 'ta' ? 'கல்வி & பயிற்சி' : 'Education & Training'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'பெறுநிலைப்படிகள், திறன் மேம்பாட்டுத் திட்டங்கள் மற்றும் தொழிற்பயிற்சி வாய்ப்புகள்.'
                  : 'Scholarships, skill development programs, and vocational training opportunities.'}
              </p>
            </div>
          </div>
          <div className="section-image-item">
            <img src="/assets/images/scheme-icon3.jpg" alt="Scheme 3" />
            <div className="section-image-content">
              <h3>
                {currentLanguage === 'ta' ? 'சுகாதாரம் & நலன்புரி' : 'Healthcare & Welfare'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'சுகாதார காப்பீடு, தாய்மை நன்மைகள் மற்றும் பெண்களுக்கான சமூக நலன்புரி திட்டங்கள்.'
                  : 'Health insurance, maternity benefits, and social welfare programs for women.'}
              </p>
            </div>
          </div>
        </div>
        <div className="cards-container">
          {filteredSchemes.slice(0, MAX_CARDS).map((scheme, index) => (
            <div 
              key={scheme._id} 
              className="card-wrapper animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <SchemeCard scheme={scheme} />
            </div>
          ))}
        </div>
        {filteredSchemes.length === 0 && (
          <div className="no-results">
            <p>No schemes found matching your search.</p>
          </div>
        )}
      </section>

      {/* Articles Section */}
      <section className="section articles-section animate-on-scroll" id="articles">
        <div className="section-header">
          <div className="section-title-wrapper">
            <h2>
              {currentLanguage === 'ta' ? 'விழிப்புணர்வு கட்டுரைகள்' : 'Awareness Articles'}
            </h2>
            <span className="section-count-badge">{animatedStats.articles}+</span>
          </div>
          <Link to="/articles" className="see-all-btn">
            {currentLanguage === 'ta' ? 'அனைத்தையும் பார்க்க →' : 'See All →'}
          </Link>
        </div>
        <p className="section-description">
          {currentLanguage === 'ta' 
            ? 'பெண்களின் சுகாதாரம், தொழில் மேம்பாடு, சட்ட விழிப்புணர்வு, வெற்றிக் கதைகள் மற்றும் தற்போதைய சிக்கல்களை உள்ளடக்கிய எங்கள் விழிப்புணர்வு கட்டுரைகளின் தொகுப்புடன் தகவலறிந்திருக்குங்கள். எங்கள் கட்டுரைகள் பெண்களின் மேம்பாடு மற்றும் வளர்ச்சிக்கான நுண்ணறிவுகள், வழிகாட்டுதல் மற்றும் ஊக்கத்தை வழங்குகின்றன.'
            : 'Stay informed with our collection of awareness articles covering women\'s health, career development, legal awareness, success stories, and current issues. Our articles provide insights, guidance, and inspiration for women\'s empowerment and growth.'}
        </p>
        <div className="section-image-containers">
          <div className="section-image-item">
            <img src="/assets/images/article-icon.jpg" alt="Article 1" />
            <div className="section-image-content">
              <h3>
                {currentLanguage === 'ta' ? 'சுகாதாரம் & ஆரோக்கியம்' : 'Health & Wellness'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'பெண்களின் சுகாதாரம், உடற்பயிற்சி, மன ஆரோக்கியம் மற்றும் தடுப்பு பராமரிப்பு குறித்த கட்டுரைகள்.'
                  : 'Articles on women\'s health, fitness, mental wellness, and preventive care.'}
              </p>
            </div>
          </div>
          <div className="section-image-item">
            <img src="/assets/images/article-icon2.jpg" alt="Article 2" />
            <div className="section-image-content">
              <h3>
                {currentLanguage === 'ta' ? 'தொழில் & தொழில்முறை' : 'Career & Professional'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'தொழில் வழிகாட்டுதல், தொழில்முறை மேம்பாட்டு உதவிக்குறிப்புகள் மற்றும் பணிபுரியும் பெண்களுக்கான வெற்றி மூலோபாயங்கள்.'
                  : 'Career guidance, professional development tips, and success strategies for working women.'}
              </p>
            </div>
          </div>
          <div className="section-image-item">
            <img src="/assets/images/article-icon3.jpg" alt="Article 3" />
            <div className="section-image-content">
              <h3>
                {currentLanguage === 'ta' ? 'சட்ட விழிப்புணர்வு' : 'Legal Awareness'}
              </h3>
              <p>
                {currentLanguage === 'ta' 
                  ? 'உங்கள் உரிமைகளைப் புரிந்துகொள்வது, சட்ட நடைமுறைகள் மற்றும் நீதியையும் பாதுகாப்பையும் எவ்வாறு நாடுவது.'
                  : 'Understanding your rights, legal procedures, and how to seek justice and protection.'}
              </p>
            </div>
          </div>
        </div>
        <div className="cards-container">
          {filteredArticles.slice(0, MAX_CARDS).map((article, index) => (
            <div 
              key={article._id} 
              className="card-wrapper animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
        {filteredArticles.length === 0 && (
          <div className="no-results">
            <p>No articles found matching your search.</p>
          </div>
        )}
      </section>

      {/* Feedback Form Section */}
      <section className="newsletter-section animate-on-scroll" id="feedback">
        <div className="newsletter-container">
          <h2>
            {currentLanguage === 'ta' ? 'உங்கள் கருத்து' : 'Your Feedback'}
          </h2>
          <p>
            {currentLanguage === 'ta'
              ? 'எங்கள் தளத்தை மேம்படுத்த உதவுவதற்கு உங்கள் கருத்தைப் பகிர்ந்து கொள்ளுங்கள்'
              : 'Share your feedback to help us improve our platform'}
          </p>
          <form className="newsletter-form" onSubmit={handleFeedbackSubmit}>
            <input
              type="text"
              name="name"
              placeholder={currentLanguage === 'ta' ? 'உங்கள் பெயர்' : 'Your name'}
              className="newsletter-input"
              value={feedbackForm.name}
              onChange={handleFeedbackChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder={currentLanguage === 'ta' ? 'உங்கள் மின்னஞ்சல்' : 'Your email'}
              className="newsletter-input"
              value={feedbackForm.email}
              onChange={handleFeedbackChange}
              required
            />
            <textarea
              name="message"
              placeholder={currentLanguage === 'ta' ? 'உங்கள் கருத்து...' : 'Your feedback...'}
              className="newsletter-input"
              style={{ minHeight: '100px', resize: 'vertical' }}
              value={feedbackForm.message}
              onChange={handleFeedbackChange}
              required
            />
            <button
              type="submit"
              className="newsletter-btn"
              disabled={feedbackSubmitting}
            >
              {feedbackSubmitting
                ? (currentLanguage === 'ta' ? 'அனுப்புகிறது...' : 'Submitting...')
                : (currentLanguage === 'ta' ? 'கருத்து அனுப்பு' : 'Send Feedback')
              }
            </button>
          </form>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section animate-on-scroll" id="testimonials">
        <div className="testimonials-container">
          <h2>
            {currentLanguage === 'ta' ? 'வெற்றி கதைகள்' : 'Success Stories'}
          </h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  {currentLanguage === 'ta'
                    ? 'இந்த தளம் எனக்கு எனது உரிமைகளை புரிந்துகொள்ளவும், எனது வாழ்க்கையை மாற்றிய அரசு திட்டங்களை அணுகவும் உதவியது.'
                    : 'This platform helped me understand my rights and access government schemes that changed my life.'}
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩</div>
                <div className="author-info">
                  <h4>{currentLanguage === 'ta' ? 'பிரியா சர்மா' : 'Priya Sharma'}</h4>
                  <p>{currentLanguage === 'ta' ? 'சிறு வணிக உரிமையாளர்' : 'Small Business Owner'}</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  {currentLanguage === 'ta'
                    ? 'சட்ட வளங்கள் மற்றும் விழிப்புணர்வு கட்டுரைகள் எனக்கு எனது உரிமைகளுக்காக போராடுவதற்கு தைரியத்தை அளித்தன.'
                    : 'The legal resources and awareness articles gave me the confidence to fight for my rights.'}
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍🎓</div>
                <div className="author-info">
                  <h4>{currentLanguage === 'ta' ? 'அஞ்சலி படேல்' : 'Anjali Patel'}</h4>
                  <p>{currentLanguage === 'ta' ? 'மாணவி' : 'Student'}</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>
                  {currentLanguage === 'ta'
                    ? 'FIR உருவாக்கியின் காரணமாக, நான் எந்த சிரமமும் இல்லாமல் சட்ட புகாரை தாக்கல் செய்ய முடிந்தது.'
                    : 'Thanks to the FIR generator, I was able to file a legal complaint without any hassle.'}
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍💼</div>
                <div className="author-info">
                  <h4>{currentLanguage === 'ta' ? 'கவிதா ரெட்டி' : 'Kavita Reddy'}</h4>
                  <p>{currentLanguage === 'ta' ? 'IT தொழில்முறை' : 'IT Professional'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
