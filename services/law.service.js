/**
 * Law Service
 * Handles all database operations related to Laws
 */

const Law = require('../models/Law.model');

class LawService {
  // Create a new law
  static async create(data) {
    const law = await Law.create(data);
    return law;
  }

  // Get all laws
  static async getAll() {
    const laws = await Law.find();
    return laws;
  }

  // Get law by ID
  static async getById(id) {
    const law = await Law.findById(id);
    if (!law) {
      throw new Error('Law not found');
    }
    return law;
  }

  // Update law by ID
  static async update(id, data) {
    const law = await Law.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!law) {
      throw new Error('Law not found');
    }
    return law;
  }

  // Delete law by ID
  static async delete(id) {
    const law = await Law.findByIdAndDelete(id);
    if (!law) {
      throw new Error('Law not found');
    }
    return true;
  }

  // Approve law by ID
  static async approve(id) {
    const law = await Law.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true, runValidators: true }
    );
    if (!law) {
      throw new Error('Law not found');
    }
    return law;
  }
}

module.exports = LawService;
