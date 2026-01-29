import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";
import { fetchArticles } from "../../features/articles/articleSlice";
import "../../styles/articleSubmission.css";

function ArticleSubmissionForm({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isTamil = i18n.language === 'ta';

  // Check if user is authenticated
  const isAuthenticated = !!localStorage.getItem('token') || !!localStorage.getItem('adminToken');

  const [formData, setFormData] = useState({
    title: "",
    title_ta: "",
    summary: "",
    summary_ta: "",
    content: "",
    content_ta: "",
    category: "General",
    tags: []
  });

  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const categories = [
    { value: "Legal", label: t('legalAwareness') },
    { value: "Health", label: t('healthHygiene') },
    { value: "Education", label: t('educationSupport') },
    { value: "Employment", label: t('digitalFinancialLiteracy') },
    { value: "General", label: t('genderEqualityRights') }
  ];

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert("Please enter a topic for AI generation");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/ai/generate-article", {
        topic: aiPrompt,
        category: formData.category
      });

      if (response.data.success) {
        const aiData = response.data.data;

        // Format and apply the generated content for both languages
        const formattedContent = aiData.content ?
          aiData.content.replace(/\n/g, '\n\n') : // Add proper spacing
          "Comprehensive awareness and education content will be provided here.";

        const formattedContentTa = aiData.content_ta ?
          aiData.content_ta.replace(/\n/g, '\n\n') : // Add proper spacing
          "விரிவான விழிப்புணர்வு மற்றும் கல்வி உள்ளடக்கம் இங்கே வழங்கப்படும்.";

        const formattedSummary = aiData.summary ?
          aiData.summary.replace(/\n/g, ' ').trim() : // Remove line breaks from summary
          "Brief summary of the awareness article content.";

        const formattedSummaryTa = aiData.summary_ta ?
          aiData.summary_ta.replace(/\n/g, ' ').trim() : // Remove line breaks from summary
          "விழிப்புணர்வு கட்டுரை உள்ளடக்கத்தின் சுருக்கமான சுருக்கம்.";

        setFormData(prev => ({
          ...prev,
          title: aiData.title ? aiData.title.trim() : prev.title,
          title_ta: aiData.title_ta ? aiData.title_ta.trim() : prev.title_ta,
          summary: formattedSummary,
          summary_ta: formattedSummaryTa,
          content: formattedContent,
          content_ta: formattedContentTa,
          tags: Array.isArray(aiData.tags) ? aiData.tags.filter(tag => tag && typeof tag === 'string' && tag.trim()) : prev.tags
        }));

        // Clear the AI prompt after successful generation
        setAiPrompt("");

        // Show success message
        alert("✅ Bilingual content generated successfully! Please review and edit both English and Tamil versions as needed before submitting.");
      }
    } catch (error) {
      console.error("AI generation failed:", error);
      alert("❌ Failed to generate content with AI. Please try again or write manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check authentication before submission
    if (!isAuthenticated) {
      alert("Please login to submit an article.");
      onClose();
      navigate("/login");
      return;
    }

    if (!formData.title.trim() || !formData.title_ta.trim() ||
        !formData.content.trim() || !formData.content_ta.trim()) {
      alert("Both English and Tamil versions of title and content are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/articles/submit", formData);

      if (response.data.success) {
        alert("Article submitted successfully! It will be reviewed by an administrator before being published.");
        // Refresh articles list
        dispatch(fetchArticles());
        onClose();
        navigate("/awareness");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="submission-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isTamil ? 'விழிப்புணர்வு கட்டுரை சமர்ப்பிப்பு' : 'Submit Awareness Article'}</h2>
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label={isTamil ? 'கட்டுரை சமர்ப்பிப்பு படிவத்தை மூடு' : 'Close article submission form'}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* AI Generation Section */}
          <div className="ai-section">
            <h3>{isTamil ? '🤖 தானியங்கி உதவியுடன் உருவாக்கு' : '🤖 Generate with AI Help'}</h3>
            <div className="ai-input-group">
              <input
                id="ai-prompt"
                name="aiPrompt"
                type="text"
                placeholder={isTamil ? "கட்டுரை தலைப்பை விவரிக்கவும் (எ.கா., 'பெண்கள் தொழில்முனைவோர் சவால்கள்')" : "Describe your article topic (e.g., 'Women entrepreneurship challenges')"}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="ai-prompt-input"
                aria-label={isTamil ? 'தானியங்கி உருவாக்கத்திற்கான கட்டுரை தலைப்பு' : 'Article topic for AI generation'}
              />
              <button
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="generate-btn"
                aria-label={isTamil ? 'தானியங்கி கட்டுரை உள்ளடக்கத்தை உருவாக்கு' : 'Generate article content with AI'}
              >
                {isGenerating ? (isTamil ? "உருவாக்கப்படுகிறது..." : "Generating...") : (isTamil ? "உள்ளடக்கத்தை உருவாக்கு" : "Generate Content")}
              </button>
            </div>
            <p className="ai-note">
              {isTamil ? '💡 பெண்கள் அதிகாரமளிப்பு தலைப்புகள் பற்றிய விரிவான, துல்லியமான உள்ளடக்கத்தை உருவாக்க தானியங்கி உதவும்' : '💡 AI will help create comprehensive, accurate content about women\'s empowerment topics'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Category Selection */}
            <div className="form-group">
              <label htmlFor="category">{isTamil ? 'பிரிவு' : 'Category'}</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title - English */}
            <div className="form-group">
              <label htmlFor="title">{isTamil ? 'தலைப்பு (ஆங்கிலம்) *' : 'Title (English) *'}</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={isTamil ? "ஆங்கிலத்தில் கட்டுரை தலைப்பை உள்ளீடு செய்யவும்" : "Enter article title in English"}
                required
                maxLength={200}
              />
              <small>{formData.title.length}/200 characters</small>
            </div>

            {/* Title - Tamil */}
            <div className="form-group">
              <label htmlFor="title_ta">{isTamil ? 'தலைப்பு (தமிழ்) *' : 'Title (தமிழ்) *'}</label>
              <input
                type="text"
                id="title_ta"
                name="title_ta"
                value={formData.title_ta}
                onChange={handleInputChange}
                placeholder={isTamil ? "தமிழில் கட்டுரை தலைப்பை உள்ளீடு செய்யவும்" : "தமிழில் கட்டுரை தலைப்பை உள்ளீடு செய்யவும்"}
                required
                maxLength={200}
              />
              <small>{formData.title_ta.length}/200 characters</small>
            </div>

            {/* Summary - English */}
            <div className="form-group">
              <label htmlFor="summary">{isTamil ? 'சுருக்கம் (ஆங்கிலம்)' : 'Summary (English)'}</label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder={isTamil ? "ஆங்கிலத்தில் கட்டுரையின் சுருக்கமான சுருக்கம் (150-200 சொற்கள் பரிந்துரைக்கப்படுகிறது)" : "Brief summary of the article in English (150-200 words recommended)"}
                rows={3}
                maxLength={500}
              />
              <small>{formData.summary.length}/500 characters</small>
            </div>

            {/* Summary - Tamil */}
            <div className="form-group">
              <label htmlFor="summary_ta">{isTamil ? 'சுருக்கம் (தமிழ்)' : 'Summary (தமிழ்)'}</label>
              <textarea
                id="summary_ta"
                name="summary_ta"
                value={formData.summary_ta}
                onChange={handleInputChange}
                placeholder={isTamil ? "தமிழில் கட்டுரையின் சுருக்கமான சுருக்கம் (150-200 சொற்கள் பரிந்துரைக்கப்படுகிறது)" : "தமிழில் கட்டுரையின் சுருக்கமான சுருக்கம் (150-200 சொற்கள் பரிந்துரைக்கப்படுகிறது)"}
                rows={3}
                maxLength={500}
              />
              <small>{formData.summary_ta.length}/500 characters</small>
            </div>

            {/* Content - English */}
            <div className="form-group">
              <label htmlFor="content">{isTamil ? 'உள்ளடக்கம் (ஆங்கிலம்) *' : 'Content (English) *'}</label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder={isTamil ? "ஆங்கிலத்தில் விரிவான கட்டுரை உள்ளடக்கம்" : "Detailed article content in English"}
                rows={8}
                required
              />
            </div>

            {/* Content - Tamil */}
            <div className="form-group">
              <label htmlFor="content_ta">{isTamil ? 'உள்ளடக்கம் (தமிழ்) *' : 'Content (தமிழ்) *'}</label>
              <textarea
                id="content_ta"
                name="content_ta"
                value={formData.content_ta}
                onChange={handleInputChange}
                placeholder={isTamil ? "தமிழில் விரிவான கட்டுரை உள்ளடக்கம்" : "தமிழில் விரிவான கட்டுரை உள்ளடக்கம்"}
                rows={8}
                required
              />
            </div>

            {/* Tags */}
            <div className="form-group">
              <label htmlFor="tag-input">{isTamil ? 'சொற்கள்' : 'Tags'}</label>
              <div className="tags-input">
                <input
                  id="tag-input"
                  name="tagInput"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder={isTamil ? "சொற்களைச் சேர்க்கவும் (Enter அழுத்தவும் அல்லது Add பொத்தானை அழுத்தவும்)" : "Add tags (press Enter or click Add)"}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  aria-label={isTamil ? "கட்டுரைக்கு சொற்களைச் சேர்க்கவும்" : "Add tags to article"}
                />
                <button type="button" onClick={handleAddTag} className="add-tag-btn" aria-label={isTamil ? "சொல்லைச் சேர்க்கவும்" : "Add tag"}>
                  {isTamil ? 'சேர்க்கவும்' : 'Add'}
                </button>
              </div>
              <div className="tags-display" role="list" aria-label={isTamil ? "கட்டுரை சொற்கள்" : "Article tags"}>
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag" role="listitem">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      aria-label={isTamil ? `சொல்லை நீக்கவும்: ${tag}` : `Remove tag: ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="cancel-btn"
                aria-label={isTamil ? "கட்டுரை சமர்ப்பிப்பை ரத்து செய்யவும்" : "Cancel article submission"}
              >
                {isTamil ? 'ரத்து செய்யவும்' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isAuthenticated}
                className="submit-btn"
                aria-label={isSubmitting ? (isTamil ? "கட்டுரை சமர்ப்பிக்கப்படுகிறது" : "Submitting article") : (isTamil ? "மேலாய்வு செய்ய சமர்ப்பிக்கவும்" : "Submit article for review")}
              >
                {isSubmitting ? (isTamil ? "சமர்ப்பிக்கப்படுகிறது..." : "Submitting...") : 
                 !isAuthenticated ? (isTamil ? "உள்நுழையவும்" : "Login Required") :
                 (isTamil ? "மேலாய்வு செய்ய சமர்ப்பிக்கவும்" : "Submit for Review")}
              </button>
            </div>
          </form>

          {/* Important Note */}
          <div className="submission-note">
            <h4>{isTamil ? '📋 முக்கிய குறிப்புகள்:' : '📋 Important Notes:'}</h4>
            <ul>
              <li>{isTamil ? 'அனைத்து சமர்ப்பிப்புகளும் வெளியீட்டிற்கு முன் நிர்வாகிகளால் ஆய்வு செய்யப்படும்' : 'All submissions are reviewed by administrators before publication'}</li>
              <li>{isTamil ? 'உள்ளடக்கம் துல்லியமானது, மரியாதையானது மற்றும் பெண்களின் அதிகாரமளிப்பில் கவனம் செலுத்த வேண்டும்' : 'Content must be accurate, respectful, and focused on women\'s empowerment'}</li>
              <li>{isTamil ? 'அங்கீகார நிலை பற்றி உங்களுக்கு அறிவிக்கப்படும்' : 'You will be notified about the approval status'}</li>
              <li>{isTamil ? 'தேவைப்பட்டால் தானியங்கி உருவாக்கப்பட்ட உள்ளடக்கத்தை ஆய்வு செய்து திருத்த வேண்டும்' : 'AI-generated content should be reviewed and edited as needed'}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

ArticleSubmissionForm.displayName = 'ArticleSubmissionForm';

export default ArticleSubmissionForm;
