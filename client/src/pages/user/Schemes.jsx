import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Loader from "../../components/common/Loader";
import SchemeCard from "../../components/cards/SchemeCard";
import LawModal from "../../components/modals/LawModal";
import { fetchSchemes } from "../../features/schemes/schemeSlice";
import "../../styles/schemes.css";

const Schemes = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { schemes, loading, error } = useSelector((state) => state.schemes);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [expandedScheme, setExpandedScheme] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    dispatch(fetchSchemes());
  }, [dispatch]);

  // Get unique categories from schemes
  const categories = useMemo(() => {
    const cats = [...new Set(schemes.map(scheme => scheme.category).filter(Boolean))];
    return ['all', ...cats];
  }, [schemes]);

  // Filter and sort schemes
  const filteredAndSortedSchemes = useMemo(() => {
    let filtered = schemes.filter(scheme => {
      const matchesSearch = scheme.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.benefits?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.eligibility?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.title_ta?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.name_ta?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.description_ta?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.benefits_ta?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.eligibility_ta?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           scheme.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort schemes
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
  }, [schemes, searchQuery, selectedCategory, sortBy]);

  const handleSchemeExpand = (schemeId) => {
    setExpandedScheme(expandedScheme === schemeId ? null : schemeId);
  };

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

  const handleLearnMore = (scheme) => {
    setSelectedScheme(scheme);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedScheme(null);
  };

  return (
    <div className="schemes-page">
      <div className="schemes-main">
        <div className="schemes-header">
          <h1 className="schemes-title">{t('governmentSchemesBenefits')}</h1>
          <p className="schemes-subtitle">{t('exploreGovernmentSchemes')}</p>
        </div>

        {/* Search and Filters */}
        <div className="schemes-filters">
          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder={t('searchSchemesByTitleDescriptionCategory')}
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
            {t('showing')} {filteredAndSortedSchemes.length} {t('schemes')}
            {searchQuery && ` ${t('schemesFor')} "${searchQuery}"`}
            {selectedCategory !== 'all' && ` ${t('in')} ${selectedCategory}`}
          </p>
        </div>

        {loading && <Loader />}

        {error && <div className="schemes-error">{error}</div>}

        {!loading && !error && filteredAndSortedSchemes.length === 0 && (
          <div className="schemes-empty">
            <div className="empty-icon">📋</div>
            <h3>{t('noSchemesFound')}</h3>
            <p>{t('tryAdjustingSearchOrFiltersSchemes')}</p>
            <button className="clear-filters-btn" onClick={resetFilters}>
              {t('clearFiltersSchemes')}
            </button>
          </div>
        )}

        {!loading && !error && filteredAndSortedSchemes.length > 0 && (
          <div className="schemes-container">
            <div className="schemes-grid">
              {filteredAndSortedSchemes.map((scheme, index) => (
                  <div
                    key={scheme._id}
                    className="scheme-card-wrapper animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <SchemeCard scheme={scheme} onLearnMore={handleLearnMore} />
                  </div>
              ))}
            </div>
          </div>
        )}

        {/* Law Modal */}
        <LawModal
          law={selectedScheme}
          isOpen={showModal}
          onClose={closeModal}
        />
      </div>
    </div>
  );
};

export default Schemes;
