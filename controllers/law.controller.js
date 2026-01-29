/**
 * Law Controller
 * Handles HTTP requests related to Laws
 */

const LawService = require('../services/law.service');
const { verifyLaw } = require('../services/ai.services');

class LawController {
  // Create a new law with AI verification
  static async createLaw(req, res, next) {
    try {
      console.log("🔄 Creating law with AI verification");

      // First create the law with ai_verifying status
      const lawData = {
        ...req.body,
        status: 'ai_verifying',
        aiVerificationResult: 'pending',
        aiVerificationNotes: 'Verification in progress',
        createdBy: req.user.id
      };

      const law = await LawService.create(lawData);

      // Start AI verification in background (don't wait for response)
      setImmediate(async () => {
        try {
          console.log("🤖 Starting AI verification for law:", law.title);

          const verificationResult = await verifyLaw({
            title: law.title,
            description: law.description,
            category: law.category,
            subCategory: law.subCategory
          });

          // Update law with AI verification results
          const updateData = {
            aiVerificationResult: verificationResult.isVerified ? 'verified' : 'not_verified',
            aiVerificationNotes: verificationResult.verificationNotes,
            status: verificationResult.isVerified ? 'approved' : 'rejected'
          };

          await LawService.update(law._id, updateData);
          console.log("✅ AI verification completed for law:", law.title, "Result:", verificationResult.isVerified);

        } catch (error) {
          console.error("❌ AI verification failed for law:", law.title, error.message);

          // Update with error status
          await LawService.update(law._id, {
            aiVerificationResult: 'error',
            aiVerificationNotes: `AI verification failed: ${error.message}`,
            status: 'rejected'
          });
        }
      });

      res.status(201).json({
        success: true,
        data: law,
        message: 'Law created successfully. AI verification in progress.'
      });
    } catch (err) {
      next(err);
    }
  }

  // Get all laws
  static async getAllLaws(req, res, next) {
    try {
      const laws = await LawService.getAll();
      res.status(200).json({ success: true, data: laws });
    } catch (err) {
      next(err);
    }
  }

  // Get a single law by ID
  static async getLawById(req, res, next) {
    try {
      const law = await LawService.getById(req.params.id);
      res.status(200).json({ success: true, data: law });
    } catch (err) {
      next(err);
    }
  }

  // Update a law by ID
  static async updateLaw(req, res, next) {
    try {
      const updatedLaw = await LawService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedLaw });
    } catch (err) {
      next(err);
    }
  }

  // Delete a law by ID
  static async deleteLaw(req, res, next) {
    try {
      await LawService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Law deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  // Approve a law by ID
  static async approveLaw(req, res, next) {
    try {
      const approvedLaw = await LawService.approve(req.params.id);
      res.status(200).json({ success: true, data: approvedLaw });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = LawController;
