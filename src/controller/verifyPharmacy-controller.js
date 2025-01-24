import Pharmacy from "../models/verifyPharmacy.js";
import PharmacyService from "../services/verifyPharmacy-service.js";


const pharmacyService = new PharmacyService();
export const updatePharmacyDetails = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    console.log("Received ID:", userId);

    

    const { ...updateData } = req.body;

    // Check if the pharmacy record exists
    const pharmacy = await pharmacyService.updatePharmacyDetails(userId,updateData)
    console.log("Pharmacy found:", pharmacy);

    if (!pharmacy) {
      return res.status(404).json({ message: 'Pharmacy details not found' });
    }

    // Update the pharmacy record with the new details
  

    console.log("Pharmacy details updated successfully:", pharmacy);
    res.status(200).json({ message: 'Pharmacy details updated successfully', data: pharmacy });
  } catch (error) {
    console.error("Error updating pharmacy details:", error);
    next(error);
  }
};

export const getPharmacyDetails = async (req, res, next) => {
  try {
    console.log("Received request to get pharmacy details:", req.user);
    const userId = req.user._id;
    const pharmacy = await pharmacyService.getPharmacyDetails(userId);
    console.log("Pharmacy details fetched successfully:", pharmacy);
    res.status(200).json({
      type: "success",
      message: "Fetched pharmacy details successfully",
      data: pharmacy,
    });
  } catch (error) {
    console.error("Error fetching pharmacy details:", error);
    next(error);
  }
};

// Admin routes
export const getAllPendingRequests = async (req, res, next) => {
  try {
    console.log("Received request to get all pending requests");
    const pendingRequests = await pharmacyService.getAllPendingRequests();
    console.log("Pending requests fetched successfully:", pendingRequests);

    res.status(200).json({
      type: "success",
      message: "Fetched all pending requests successfully",
      data: pendingRequests,
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({
      type: "error",
      message: "Error fetching pending requests",
      error: error.message,
    });
  }
};

export const getAllApprovedPharmacies = async (req, res, next) => {
  try {
    console.log("Received request to get all approved pharmacies");
    const approvedPharmacies = await pharmacyService.getAllApprovedPharmacies();
    console.log("Approved pharmacies fetched successfully:", approvedPharmacies);

    res.status(200).json({
      type: "success",
      message: "Fetched all approved pharmacies successfully",
      data: approvedPharmacies,
    });
  } catch (error) {
    console.error("Error fetching approved pharmacies:", error);
    res.status(500).json({
      type: "error",
      message: "Error fetching approved pharmacies",
      error: error.message,
    });
  }
};
export const setPharmacyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    console.log(id)
    console.log(status)
    const updatedPharmacy = await pharmacyService.setPharmacyStatus(id, status);

    res.status(200).json({
      type: "success",
      message: `Pharmacy details ${status}`,
      data: updatedPharmacy,
    });
  } catch (error) {
    console.error("Error setting pharmacy status:", error.message);
    res.status(500).json({
      type: "error",
      message: "Internal server error",
      error: error.message,
    });
    next(error);
  }
};


