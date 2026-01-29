/**
 * Scheme Controller
 * Handles HTTP requests related to Schemes
 */

const SchemeService = require('../services/scheme.service');
const { verifyScheme } = require('../services/ai.services');

class SchemeController {
  // Create a new scheme with AI verification
  static async createScheme(req, res, next) {
    try {
      console.log("🔄 Creating scheme with AI verification");

      // First create the scheme with ai_verifying status
      const schemeData = {
        ...req.body,
        status: 'ai_verifying',
        aiVerificationResult: 'pending',
        aiVerificationNotes: 'Verification in progress',
        createdBy: req.user.id
      };

      const scheme = await SchemeService.create(schemeData);

      // Start AI verification in background (don't wait for response)
      setImmediate(async () => {
        try {
          console.log("🤖 Starting AI verification for scheme:", scheme.name);

          const verificationResult = await verifyScheme({
            name: scheme.name,
            eligibility: scheme.eligibility,
            benefits: scheme.benefits,
            link: scheme.link
          });

          // Update scheme with AI verification results
          const updateData = {
            aiVerificationResult: verificationResult.isVerified ? 'verified' : 'not_verified',
            aiVerificationNotes: verificationResult.verificationNotes,
            status: verificationResult.isVerified ? 'approved' : 'rejected'
          };

          await SchemeService.update(scheme._id, updateData);
          console.log("✅ AI verification completed for scheme:", scheme.name, "Result:", verificationResult.isVerified);

        } catch (error) {
          console.error("❌ AI verification failed for scheme:", scheme.name, error.message);

          // Update with error status
          await SchemeService.update(scheme._id, {
            aiVerificationResult: 'error',
            aiVerificationNotes: `AI verification failed: ${error.message}`,
            status: 'rejected'
          });
        }
      });

      res.status(201).json({
        success: true,
        data: scheme,
        message: 'Scheme created successfully. AI verification in progress.'
      });
    } catch (err) {
      next(err);
    }
  }

  // Get all schemes
  static async getAllSchemes(req, res, next) {
    try {
      const schemes = await SchemeService.getAll();
      res.status(200).json({ success: true, data: schemes });
    } catch (err) {
      next(err);
    }
  }

  // Get a single scheme by ID
  static async getSchemeById(req, res, next) {
    try {
      const scheme = await SchemeService.getById(req.params.id);
      res.status(200).json({ success: true, data: scheme });
    } catch (err) {
      next(err);
    }
  }

  // Update a scheme by ID
  static async updateScheme(req, res, next) {
    try {
      const updatedScheme = await SchemeService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: updatedScheme });
    } catch (err) {
      next(err);
    }
  }

  // Delete a scheme by ID
  static async deleteScheme(req, res, next) {
    try {
      await SchemeService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Scheme deleted successfully' });
    } catch (err) {
      next(err);
    }
  }

  // Approve a scheme by ID
  static async approveScheme(req, res, next) {
    try {
      const approvedScheme = await SchemeService.approve(req.params.id);
      res.status(200).json({ success: true, data: approvedScheme });
    } catch (err) {
      next(err);
    }
  }

  // Get AI-powered scheme recommendations
  static async getSchemeRecommendations(req, res, next) {
    try {
      const { userProfile } = req.body;
      const recommendations = await SchemeService.getRecommendations(userProfile);
      res.status(200).json({ success: true, data: recommendations });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SchemeController;
