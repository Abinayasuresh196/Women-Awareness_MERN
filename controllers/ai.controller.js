const { analyzeComplaint, generateFIRDraft, generateArticleContent } = require("../services/ai.services");

exports.legalAnalysis = async (req, res) => {
  try {
    const { complaint } = req.body;

    if (!complaint) {
      return res.status(400).json({ success: false, message: "Complaint required" });
    }

    const result = await analyzeComplaint(complaint);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "AI analysis failed" });
  }
};

exports.generateFIR = async (req, res) => {
  try {
    const { complaintData } = req.body;

    if (!complaintData) {
      return res.status(400).json({ success: false, message: "Complaint data required" });
    }

    const result = await generateFIRDraft(complaintData);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "FIR generation failed" });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { complaint, userProfile } = req.body;

    if (!complaint) {
      return res.status(400).json({ success: false, message: "Complaint description required" });
    }

    // Simple keyword-based recommendation logic
    const recommendations = {
      laws: [],
      schemes: []
    };

    const lowerComplaint = complaint.toLowerCase();

    // Law recommendations based on keywords
    if (lowerComplaint.includes('domestic violence') || lowerComplaint.includes('abuse')) {
      recommendations.laws.push({
        title: 'Protection of Women from Domestic Violence Act, 2005',
        description: 'Provides protection to women from domestic violence and covers physical, emotional, sexual, verbal, and economic abuse.',
        relevance: 'High'
      });
    }

    if (lowerComplaint.includes('harassment') || lowerComplaint.includes('workplace')) {
      recommendations.laws.push({
        title: 'Sexual Harassment of Women at Workplace Act, 2013',
        description: 'Seeks to protect women from sexual harassment at their place of work.',
        relevance: 'High'
      });
    }

    if (lowerComplaint.includes('dowry')) {
      recommendations.laws.push({
        title: 'Dowry Prohibition Act, 1961',
        description: 'Prohibits the giving or taking of dowry at or before or any time after the marriage.',
        relevance: 'High'
      });
    }

    // Scheme recommendations based on keywords and profile
    if (lowerComplaint.includes('financial') || lowerComplaint.includes('economic')) {
      recommendations.schemes.push({
        title: 'Pradhan Mantri Matru Vandana Yojana',
        description: 'Maternity benefit program providing financial assistance to pregnant women.',
        relevance: 'High'
      });
    }

    if (userProfile && userProfile.gender === 'female') {
      recommendations.schemes.push({
        title: 'Beti Bachao Beti Padhao',
        description: 'Scheme to address declining child sex ratio and promote girl child education.',
        relevance: 'Medium'
      });
    }

    res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Recommendation generation failed" });
  }
};

exports.generateArticle = async (req, res) => {
  try {
    console.log("🔄 Received AI article generation request");
    const { topic, category } = req.body;
    
    console.log("Request body:", { topic, category });

    if (!topic || !category) {
      console.log("❌ Missing topic or category");
      return res.status(400).json({
        success: false,
        message: "Topic and category are required"
      });
    }

    console.log("🤖 Calling generateArticleContent service...");
    const result = await generateArticleContent(topic, category);
    
    console.log("✅ Service returned result:", result);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("❌ Article generation error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      status: error.status,
      code: error.code,
      type: error.type
    });
    
    res.status(500).json({
      success: false,
      message: "Article generation failed"
    });
  }
};
