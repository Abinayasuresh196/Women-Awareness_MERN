import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../../components/common/Loader";
import api from "../../services/api";
import "../../styles/articleDetails.css";

const ArticleDetails = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/articles/${id}`);
        if (res.data.success) {
          setArticle(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load article", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <Loader />;

  if (!article) {
    return <p className="no-article">Article not found</p>;
  }

  return (
    <div className="article-details">
      <img
        src={article.image || "https://via.placeholder.com/900x400"}
        alt={article.title}
        className="article-banner"
      />

      <div className="article-body">
        <h1>{article.title}</h1>
        <span className="article-category">{article.category}</span>
        <p className="article-content">{article.content}</p>
      </div>
    </div>
  );
};

export default ArticleDetails;
