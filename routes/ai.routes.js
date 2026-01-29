const express = require("express");
const router = express.Router();
const { legalAnalysis, generateFIR, getRecommendations, generateArticle } = require("../controllers/ai.controller");

router.post("/legal-assistant", legalAnalysis);
router.post("/generate-fir", generateFIR);
router.post("/recommend-laws", getRecommendations);
router.post("/generate-article", generateArticle);

module.exports = router;
