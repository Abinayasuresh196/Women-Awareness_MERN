import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import LawCard from "../../components/cards/LawCard";
import LawModal from "../../components/modals/LawModal";
import { fetchLaws } from "../../features/laws/lawSlice";
import "../../styles/laws.css";

const Laws = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { laws, loading, error } = useSelector((state) => state.laws);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showModal, setShowModal] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState(null);

  useEffect(() => {
    dispatch(fetchLaws());
  }, [dispatch]);

  
  // Get unique categories from laws
  const categories = useMemo(() => {
    const cats = [...new Set(laws.map(law => law.category).filter(Boolean))];
    return ['all', ...cats];
  }, [laws]);

  // Filter and sort laws
  const filteredAndSortedLaws = useMemo(() => {
    let filtered = laws.filter(law => {
      const matchesSearch = law.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           law.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           law.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || law.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort laws
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
  }, [laws, searchQuery, selectedCategory, sortBy]);

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

  
  const handleLearnMore = (law) => {
    setSelectedLaw(law);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLaw(null);
  };

  return (
    <div className="laws-page">
      <div className="laws-main">
        <div className="laws-header">
          <h1 className="laws-title">{t('womenRightsLaws')}</h1>
          <p className="laws-subtitle">{t('exploreComprehensiveLegalResources')}</p>
        </div>

        {/* Search and Filters */}
        <div className="laws-filters">
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder={t('searchLawsByTitleDescriptionCategory')}
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <button className="search-btn">
                <span>🔎</span>
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
                {categories.map(category => (
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
            {t('showing')} {filteredAndSortedLaws.length} {t('laws')}
            {searchQuery && ` ${t('lawsFor')} "${searchQuery}"`}
            {selectedCategory !== 'all' && ` ${t('in')} ${selectedCategory}`}
          </p>
        </div>

        {loading && <Loader />}

        {error && <div className="laws-error">{error}</div>}

        {!loading && !error && filteredAndSortedLaws.length === 0 && (
          <div className="laws-empty">
            <div className="empty-icon">📜</div>
            <h3>{t('noLawsFound')}</h3>
            <p>{t('tryAdjustingSearchOrFilters')}</p>
            <button className="clear-filters-btn" onClick={resetFilters}>
              {t('clearFilters')}
            </button>
          </div>
        )}

          {!loading && !error && filteredAndSortedLaws.length > 0 && (
          <div className="laws-container">
            <div className="laws-grid">
              {filteredAndSortedLaws.map((law, index) => (
                <div
                  key={law._id}
                  className="law-card-wrapper animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <LawCard
                    law={law}
                    onLearnMore={handleLearnMore}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Law Modal */}
        <LawModal
          law={selectedLaw}
          isOpen={showModal}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default Laws;
