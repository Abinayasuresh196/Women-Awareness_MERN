import React, { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import ArticleCard from "../../components/cards/ArticleCard";
import api from "../../services/api";
import "../../styles/articles.css";

const ITEMS_PER_PAGE = 6;

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get("/articles");
        if (res.data.success) {
          // Extract articles from the response structure: { articles: [...], pagination: {...} }
          const articlesData = Array.isArray(res.data.articles) ? res.data.articles : (Array.isArray(res.data.data) ? res.data.data : []);
          setArticles(articlesData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filteredArticles = articles.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "all" || a.category === category;
    return matchSearch && matchCategory;
  });

  const paginatedArticles = filteredArticles.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);

  return (
    <div className="articles-page">
      <h2 className="page-title">Awareness Articles</h2>

      <div className="article-controls">
        <input
          type="text"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All Categories</option>
          <option value="Legal">Legal</option>
          <option value="Health">Health</option>
          <option value="Safety">Safety</option>
        </select>
      </div>

      {loading && <Loader />}

      <div className="articles-grid">
        {paginatedArticles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Articles;
