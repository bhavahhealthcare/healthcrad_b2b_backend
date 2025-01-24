import Pharmacy from "../models/verifyPharmacy.js";

class PharmacyRepository {
    async createPharmacy(pharmacyData) {
        try {
          const pharmacy = new Pharmacy(pharmacyData);
          await pharmacy.save();
          return pharmacy;
        } catch (error) {
          throw error;
        }
      }

    async findById(id) {
        try {
            return await Pharmacy.findById(id);
        } catch (error) {
            throw new Error(`Error finding pharmacy by ID: ${error.message}`);
        }
    }

    // async updateById(id, data) {
    //     try {
    //         return await Pharmacy.findByIdAndUpdate(id, { ...data, status: 'pending' }, { new: true });
    //     } catch (error) {
    //         throw new Error(`Error updating pharmacy: ${error.message}`);
    //     }
    // }
    async updatedPharmacybyId(id, data) {
        try {
            const updatedPharmacy = await Pharmacy.findByIdAndUpdate(id, data, { new: true });
            // await updatedPharmacy.save(); // Save the updated document
            return updatedPharmacy;
        } catch (error) {
            throw new Error(`Error updating pharmacy: ${error.message}`);
        }
    }
    async updateById(id, data) {
        try {
            const { status = 'pending', ...rest } = data;
            const updatedPharmacy = await Pharmacy.findByIdAndUpdate(id, { ...rest, status }, { new: true });
            await updatedPharmacy.save(); // Save the updated document
            return updatedPharmacy;
        } catch (error) {
            throw new Error(`Error updating pharmacy: ${error.message}`);
        }
    }
    

    async findAll(filter) {
        try {
            return await Pharmacy.find(filter);
        } catch (error) {
            throw new Error(`Error finding pharmacies: ${error.message}`);
        }
    }
   
}

export default PharmacyRepository;
