/**
 * Scheme Service
 * Handles all database operations related to Schemes
 */

const Scheme = require('../models/Scheme.model');

class SchemeService {
  // Create a new scheme
  static async create(data) {
    const scheme = await Scheme.create(data);
    return scheme;
  }

  // Get all schemes
  static async getAll() {
    const schemes = await Scheme.find();
    return schemes;
  }

  // Get scheme by ID
  static async getById(id) {
    const scheme = await Scheme.findById(id);
    if (!scheme) {
      throw new Error('Scheme not found');
    }
    return scheme;
  }

  // Update scheme by ID
  static async update(id, data) {
    const scheme = await Scheme.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!scheme) {
      throw new Error('Scheme not found');
    }
    return scheme;
  }

  // Delete scheme by ID
  static async delete(id) {
    const scheme = await Scheme.findByIdAndDelete(id);
    if (!scheme) {
      throw new Error('Scheme not found');
    }
    return true;
  }

  // Approve scheme by ID
  static async approve(id) {
    const scheme = await Scheme.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true, runValidators: true }
    );
    if (!scheme) {
      throw new Error('Scheme not found');
    }
    return scheme;
  }

  // Get AI-powered scheme recommendations based on user profile
  static async getRecommendations(userProfile) {
    try {
      const { age, gender, income, category, state } = userProfile;

      // Get all schemes
      const allSchemes = await Scheme.find();

      // Simple recommendation algorithm
      const recommendations = allSchemes.map(scheme => {
        let score = 0;

        // Age-based scoring (younger people get higher scores for education schemes)
        if (age && parseInt(age) < 25) {
          // Education and skill development schemes
          score += 20;
        } else if (age && parseInt(age) > 50) {
          // Pension and senior citizen schemes
          score += 15;
        }

        // Gender-based scoring
        if (gender === 'female') {
          // Women-specific schemes
          score += 25;
        }

        // Income-based scoring
        if (income === 'below-5000') {
          // Poverty alleviation schemes
          score += 30;
        } else if (income === 'above-30000') {
          // Investment schemes
          score += 10;
        }

        // Category-based scoring
        if (category === 'sc' || category === 'st' || category === 'obc') {
          // Reservation category schemes
          score += 25;
        } else if (category === 'minority') {
          // Minority schemes
          score += 20;
        }

        // Random factor to add some variety
        score += Math.random() * 10;

        return {
          ...scheme.toObject(),
          matchScore: Math.min(Math.round(score), 100)
        };
      });

      // Sort by match score and return top 5
      return recommendations
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);

    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }
}

module.exports = SchemeService;
