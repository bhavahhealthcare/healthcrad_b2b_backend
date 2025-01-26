import PharmacyRepository from "../repository/verifyPharmacy-repository.js";
import UserRepository from "../repository/user-repository.js";
import mongoose from "mongoose";
import { publishToQueue } from "../utils/notification.utils.js";
class PharmacyService {
  constructor() {
    this.pharmacyRepository = new PharmacyRepository();
    this.userRepository = new UserRepository();
  }
  async createNewPharmacy(pharmacyData) {
    try {
      return await this.pharmacyRepository.createPharmacy(pharmacyData);
    } catch (error) {
      throw error;
    }
  }
  async updatePharmacyDetails(userId, data) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw {
          status: 404,
          message: 'User not found'
        };
      }
      const pharmacyId = user.pharmacyId;
      if (!mongoose.Types.ObjectId.isValid(pharmacyId)) {
        return {
          status: 400,
          message: 'Invalid pharmacy ID'
        };
      }
      const pharmacy = await this.pharmacyRepository.findById(pharmacyId);
      if (!pharmacy) {
        throw {
          status: 404,
          message: 'Pharmacy details not found'
        };
      }
      const updatedPharmacy = await this.pharmacyRepository.updatedPharmacybyId(pharmacyId, {
        ...data
      });
      const notification = {
        userId: userId,
        message: 'Your pharmacy details have been updated.',
        pharmacyId: pharmacyId
      };
      publishToQueue('notifications', JSON.stringify(notification));
      return {
        status: 200,
        data: updatedPharmacy
      };
    } catch (error) {
      if (error.status) {
        return {
          status: error.status,
          message: error.message
        };
      }
      console.error('Error updating pharmacy details:', error);
      return {
        status: 500,
        message: 'Internal server error'
      };
    }
  }
  async getPharmacyDetails(userId) {
    try {
      const pharmacy = await this.pharmacyRepository.findById(userId);
      if (!pharmacy) {
        throw {
          status: 404,
          message: 'Pharmacy details not found'
        };
      }
      return pharmacy;
    } catch (error) {
      throw error;
    }
  }
  async getAllPendingRequests() {
    try {
      const pendingRequests = await this.pharmacyRepository.findAll({
        status: 'pending'
      });
      console.log(pendingRequests);
      return pendingRequests;
    } catch (error) {
      throw new Error(`Error fetching pending requests: ${error.message}`);
    }
  }
  async getAllApprovedPharmacies() {
    try {
      const approvedPharmacy = await this.pharmacyRepository.findAll({
        status: 'approved'
      });
      return approvedPharmacy;
    } catch (error) {
      throw new Error(`Error fetching approved pharmacies: ${error.message}`);
    }
  }
  async setPharmacyStatus(id, status) {
    try {
      const updatedPharmacy = await this.pharmacyRepository.updateById(id, {
        status
      }, {
        new: true
      });
      if (!updatedPharmacy) {
        throw new Error("Pharmacy not found");
      }
      return updatedPharmacy;
    } catch (error) {
      throw new Error(`Error setting pharmacy status: ${error.message}`);
    }
  }
}
export default PharmacyService;