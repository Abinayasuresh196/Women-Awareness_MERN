import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../../styles/reportModal.css";

const ReportModal = ({ article, isOpen, onClose }) => {
  const [reportContent, setReportContent] = useState("");
  const [generating, setGenerating] = useState(false);
  const { i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';

  useEffect(() => {
    if (isOpen && article) {
      generateReport();
    }
  }, [isOpen, article]);

  const generateReport = async () => {
    setGenerating(true);
    try {
      // Simulate API call to generate report
      // In a real implementation, this would call your AI service
      setTimeout(() => {
        const report = generateAutoReport(article);
        setReportContent(report);
        setGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to generate report:", error);
      setGenerating(false);
    }
  };

  const generateAutoReport = (article) => {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    if (isTamil) {
      return `# விழிப்புணர்வு கட்டுரை அறிக்கை

**உருவாக்கப்பட்ட தேதி:** ${currentDate} ${currentTime}

## கட்டுரை சுருக்கம்
**தலைப்பு:** ${article.title}
**பிரிவு:** ${article.category}
**கட்டுரை ஐடி:** ${article._id}

## சுருக்கம்
${article.summary_ta || article.summary || "இந்தக் கட்டுரை பெண்களின் உரிமைகள், பாதுகாப்பு மற்றும் அதிகாரமளிப்பு திட்டங்கள் பற்றிய விரிவான தகவல்களை வழங்குகிறது."}

## விரிவான பகுப்பாய்வு

### முக்கிய தலைப்புகள்
- பெண்களின் பாதுகாப்பு மற்றும் பாதுகாப்பு நடவடிக்கைகள்
- சட்டபூர்வமான உரிமைகள் மற்றும் பாதுகாப்பு
- ஆதரவு சேவைகளுக்கு அணுகல்
- சமூக அதிகாரமளிப்பு திட்டங்கள்
- கல்வி மற்றும் விழிப்புணர்வு முயற்சிகள்

### இலக்கு பார்வையாளர்கள்
- அனைத்து வயது பெண்கள்
- புறக்கணிக்கப்பட்ட மற்றும் பாதிக்கப்பட்ட சமூகங்கள்
- குடும்ப உறுப்பினர்கள் மற்றும் பராமரிப்பாளர்கள்
- சமூக தலைவர்கள் மற்றும் ஆதரவு பணியாளர்கள்

### முக்கியத்துவம் மற்றும் தாக்கம்
இந்தக் கட்டுரை பாலின சமத்துவத்தையும் பெண்களின் அதிகாரமளிப்பையும் ஊக்குவிப்பதற்கு ஒரு முக்கிய வளமாக செயல்படுகிறது. கிடைக்கக்கூடிய ஆதரவு அமைப்புகள் பற்றிய அத்தியாவசிய தகவல்களை வழங்குகிறது மற்றும் சமூக வளங்களுடன் செயல்படுவதை ஊக்குவிக்கிறது.

### பரிந்துரைகள்
1. **பரப்புரை:** இந்த தகவல்களை சமூகங்களில் அகலமாகப் பகிர்ந்து கொள்ளுங்கள்
2. **பின்தொடர்தல்:** தேவைப்படும்போது ஆதரவு சேவைகளைத் தொடர்பு கொள்ள வாசகர்களை ஊக்குவிக்கவும்
3. **கல்வி:** விழிப்புணர்வு பயிற்சி மற்றும் பயிற்சிகளுக்கு இந்த உள்ளடக்கத்தைப் பயன்படுத்தவும்
4. **கண்காணிப்பு:** தொடர்ந்து மேம்படுத்துவதற்காக ஈடுபாடு மற்றும் பின்னூட்டங்களைக் கண்காணிக்கவும்

### அவசர தொடர்புகள்
- **பெண்கள் உதவித்தொலைபேசி:** 181 (24/7 அவசர ஆதரவு)
- **காவல் அவசரம்:** 112 (உடனடி உதவி)
- **குழந்தை உதவித்தொலைபேசி:** 1098 (குழந்தை சார்ந்த கவலைகள்)

### முக்கிய நன்மைகள்
- **சட்டபூர்வமான உரிமைகள் விழிப்புணர்வு**
- **பாதுகாப்பு மற்றும் பாதுகாப்பு**
- **சமூக ஆதரவு**
- **அதிகாரமளிப்பு திட்டங்கள்**

### விரைவான நடவடிக்கைகள்
- **உதவித்தொலைபேசி:** 181
- **அவசரம்:** 112

### குறிப்பு
இந்த சேவை முற்றிலும் இலவசம் மற்றும் ரகசியமானது. தேவைப்படும் பெண்களுக்கு 24/7 உதவி கிடைக்கிறது.

### முடிவுரை
இந்த விழிப்புணர்வுக் கட்டுரை பெண்களின் பாதுகாப்பு மற்றும் அதிகாரமளிப்பின் முக்கிய அம்சங்களை சிறப்பாக முகாமைத்துவம் செய்கிறது. வழங்கப்பட்டுள்ள தகவல்கள் விரிவானவை மற்றும் செயல்படுத்தக்கூடியவை, சமூகக் கல்வி மற்றும் ஆதரவுக்கான ஒரு முக்கிய கருவியாக செயல்படுகிறது.

---
*பெண்கள் விழிப்புணர்வு தளத்தால் தானியங்கி உருவாக்கப்பட்ட அறிக்கை*
*அதிகாரப்பூர்வ பயன்பாட்டிற்கும் குறிப்பு நோக்கங்களுக்கும்*`;
    }

    return `# Awareness Article Report

**Generated on:** ${currentDate} at ${currentTime}

## Article Overview
**Title:** ${article.title}
**Category:** ${article.category}
**Article ID:** ${article._id}

## Summary
${article.summary || "This article provides comprehensive information about women's rights, safety, and empowerment initiatives."}

## Detailed Analysis

### Key Topics Covered
- Women's safety and security measures
- Legal rights and protections
- Access to support services
- Community empowerment programs
- Educational and awareness initiatives

### Target Audience
- Women of all age groups
- Marginalized and vulnerable communities
- Family members and caregivers
- Community leaders and support workers

### Importance and Impact
This article serves as a crucial resource for promoting gender equality and women's empowerment. It provides essential information about available support systems and encourages proactive engagement with community resources.

### Recommendations
1. **Distribution:** Share this information widely within communities
2. **Follow-up:** Encourage readers to contact support services when needed
3. **Education:** Use this content for awareness workshops and training programs
4. **Monitoring:** Track engagement and feedback for continuous improvement

### Emergency Contacts
- **Women Helpline:** 181 (24/7 emergency support)
- **Police Emergency:** 112 (immediate assistance)
- **Child Helpline:** 1098 (child-related concerns)

### Key Benefits
- **Legal Rights Awareness**
- **Safety & Security**
- **Community Support**
- **Empowerment Programs**

### Quick Actions
- **Helpline:** 181
- **Emergency:** 112

### Note
This service is completely free and confidential. Help is available 24/7 for women in need.

### Conclusion
This awareness article effectively addresses critical aspects of women's safety and empowerment. The information provided is comprehensive and actionable, serving as an important tool for community education and support.

---
*Report generated automatically by Women Awareness Platform*
*For official use and reference purposes*`;
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="report-modal-overlay" onClick={handleBackdropClick}>
      <div className="report-modal">
        <button
          className="report-modal-close"
          onClick={onClose}
          title="Close Report"
        >
          ❌
        </button>

        <div className="report-modal-header">
          <h2>{isTamil ? 'விழிப்புணர்வு கட்டுரை அறிக்கை' : 'Awareness Article Report'}</h2>
          <p style={{ color: 'white', textAlign: 'center' }}>{isTamil ? 'தானியங்கி உருவாக்கப்பட்ட விரிவான அறிக்கை:' : 'Auto-generated comprehensive report for:'} <strong style={{ color: 'white' }}>{article?.title}</strong></p>
        </div>

        <div className="report-modal-content">
          {generating ? (
            <div className="report-loading">
              <div className="loading-spinner"></div>
              <p>Generating report...</p>
              <small>Please wait while we analyze the article content</small>
            </div>
          ) : (
            <div className="report-content">
              <div className="report-section">
                <pre>{reportContent}</pre>
              </div>
            </div>
          )}
        </div>

        <div className="report-modal-footer">
          <button
            className="report-close-btn"
            onClick={onClose}
            disabled={generating}
          >
            {isTamil ? 'மூடு & விழிப்புணர்வுக்கு திரும்பு' : 'Close & Return to Awareness'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
