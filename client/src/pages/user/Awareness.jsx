// src/pages/user/Awareness.jsx

import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ArticleCard from "../../components/cards/ArticleCard";
import ArticleModal from "../../components/modals/ArticleModal";
import Loader from "../../components/common/Loader";
import ArticleSubmissionForm from "../../components/forms/ArticleSubmissionForm";
import { fetchArticles } from "../../features/articles/articleSlice";
import "../../styles/awareness.css";

const Awareness = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { articles, loading, error } = useSelector((state) => state.articles);
  const isTamil = i18n.language === 'ta';

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
    // Fetch all articles without pagination for the Awareness page
    dispatch(fetchArticles());
  }, [dispatch]);

  // Get unique categories from articles
  const uniqueCategories = useMemo(() => {
    if (!Array.isArray(articles)) return ['all'];
    
    const cats = [...new Set(articles.map(article => article.category).filter(Boolean))];
    return ['all', ...cats];
  }, [articles]);

  // Filter and sort articles
  const filteredAndSortedArticles = useMemo(() => {
    if (!Array.isArray(articles)) return [];
    
    let filtered = articles.filter(article => {
      const matchesSearch = article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           article.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'alphabetical':
          return (a.title || '').localeCompare(b.title || '');
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [articles, searchQuery, selectedCategory, sortBy]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("recent");
  };

  const handleOpenSubmission = () => {
    setShowSubmissionForm(true);
  };

  const handleCloseSubmission = () => {
    setShowSubmissionForm(false);
  };

  return (
    <>
      <div className="awareness-page">
        <div className="awareness-main">
          <div className="awareness-header">
            <div className="header-content">
              <div className="title-section">
                <h1 className="awareness-title">{t('awarenessArticles')}</h1>
                <p className="awareness-subtitle">{t('exploreAwarenessArticlesWomen')}</p>
              </div>
              <div className="header-actions">
                <button className="add-article-btn header-btn" onClick={handleOpenSubmission}>
                  {t('addArticle')}
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="awareness-filters">
            <div className="search-section">
              <div className="search-box">
                <input
                  type="text"
                  placeholder={t('searchArticles')}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                <button className="search-btn">
                  <span>🔍</span>
                </button>
              </div>
            </div>

            <div className="filters-row">
              <div className="category-filter">
                <label>{t('category')}:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="filter-select"
                >
                  {uniqueCategories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? t('allCategories') : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sort-filter">
                <label>{t('sortBy')}:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="recent">{t('mostRecent')}</option>
                  <option value="alphabetical">{t('alphabetical')}</option>
                  <option value="category">{t('byCategory')}</option>
                </select>
              </div>

              <button className="reset-btn" onClick={resetFilters}>
                {t('resetFilters')}
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="results-summary">
            <p>
              {isTamil 
                ? `காட்சிப்படுத்தப்படுகின்றன: ${filteredAndSortedArticles.length} கட்டுரைகள்`
                : `${t('showing')} ${filteredAndSortedArticles.length} ${t('articles')}`
              }
              {searchQuery && ` ${isTamil ? 'தேடல்:' : t('articlesFor')} "${searchQuery}"`}
              {selectedCategory !== 'all' && ` ${isTamil ? 'பிரிவில்:' : t('in')} ${selectedCategory}`}
            </p>
          </div>

          {loading && <Loader />}

          {error && <div className="awareness-error">{error}</div>}

          {!loading && !error && filteredAndSortedArticles.length === 0 && (
            <div className="awareness-empty">
              <div className="empty-icon">📚</div>
              <h3>{t('noAwarenessInitiativesFound')}</h3>
              <p>{t('noAwarenessInitiativesFoundDesc')}</p>
              <button className="clear-filters-btn" onClick={resetFilters}>
                {t('clearFilters')}
              </button>
            </div>
          )}

          {!loading && !error && filteredAndSortedArticles.length > 0 && (
            <div className="awareness-container">
              <div className="awareness-grid">
                {filteredAndSortedArticles.map((article, index) => (
                  <div
                    key={article._id}
                    className="article-card-wrapper animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ArticleCard
                      article={article}
                      onOpenSubmission={handleOpenSubmission}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ArticleSubmissionForm
        isOpen={showSubmissionForm}
        onClose={handleCloseSubmission}
      />
    </>
  );
};

export default Awareness;
