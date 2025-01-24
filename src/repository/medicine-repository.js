import Medicine from "../models/medicine.js"


class MedicineRepository {
  async getMedicine(id) {
    try {
      const medicine = await Medicine.findById(id);
      return medicine;
    } catch (error) {
      console.log('Error in getMedicine repository method:', error);
      throw { error };
    }
  }

  async getAllMedicines() {
    try {
      const medicines = await Medicine.find();
      return medicines;
    } catch (error) {
      console.log('Error in getAllMedicines repository method:', error);
      throw { error };
    }
  }

  async createMedicine(medicineData) {
    try {
      const newMedicine = new Medicine(medicineData);
      await newMedicine.save();
      return newMedicine;
    } catch (error) {
      console.error('Error in createMedicine repository method:', error);
      throw { error };
    }
  }

  async deleteMedicine(id) {
    try {
      const deletedMedicine = await Medicine.findByIdAndDelete(id);
      return deletedMedicine;
    } catch (error) {
      console.log('Error in deleteMedicine repository method:', error);
      throw { error };
    }
  }

  async updateMedicine(id, updatedData) {
    try {
      const updatedMedicine = await Medicine.findByIdAndUpdate(
        id,
        updatedData,
        { new: true }
      );
      return updatedMedicine;
    } catch (error) {
      console.log('Error in updateMedicine repository method:', error);
      throw { error };
    }
  }

  async getMedicinesByManufacturer(manufacturer) {
    try {
      const medicines = await Medicine.find({ MANUFACTURER: manufacturer });
      return medicines;
    } catch (error) {
      console.error(
        'Error in getMedicinesByManufacturer repository method:',
        error
      );
      throw { error };
    }
  }

  async updateDiscountByManufacturer(manufacturer, discount) {
    try {
        const previousMedicines = await Medicine.find({ MANUFACTURER: manufacturer });

        // Assuming all medicines by the same manufacturer have the same discount
        const previousDiscount = previousMedicines.length > 0 ? previousMedicines[0].DISCOUNT : 0;

        const result = await Medicine.updateMany(
            { MANUFACTURER: manufacturer },
            { $set: { DISCOUNT: discount } }
        );

        return { result, previousDiscount };
    } catch (error) {
        console.error('Error in updateDiscountByManufacturer repository method:', error);
        throw { error };
    }
}

  async insertManyMedicines(medicinesData) {
    try {
      const result = await Medicine.insertMany(medicinesData);
      return result;
    } catch (error) {
      console.error('Error in insertManyMedicines repository method:', error);
      throw { error };
    }
  }
  async searchMedicines(query) {
    try {
      const searchQuery = {
        $or: [
          { NAME: { $regex: query, $options: 'i' } },
          { COMPOSITION: { $regex: query, $options: 'i' } },
          { MANUFACTURER: { $regex: query, $options: 'i' } },
          { TYPE: { $regex: query, $options: 'i' } },
        ],
      };
      const result = await Medicine.find(searchQuery);
      return result;
    } catch (error) {
      console.error('Error in searchMedicines repository method:', error);
      throw { error };
    }
  }
  async getManufacturersByCategory(category) {
    try {
      const manufacturers = await Medicine.distinct('MANUFACTURER', { CATEGORY: category });
      console.log("repo manu",manufacturers)
      return manufacturers;
    } catch (error) {
      console.error('Error in getManufacturersByCategory repository method:', error);
      throw { error };
    }
  }
  async updatePriceByMedicine(medicineId, newPrice, discount) {
    try {
      console.log("medicine id in repio",medicineId)
        const result = await Medicine.updateOne({ _id: medicineId }, {
            $set: {
                Final_PURCHASE_RATE: newPrice,
                DISCOUNT: discount // Ensure discount is stored in the database
            }
        });
    
        return result;
    } catch (error) {
        console.error('Error in updatePriceByMedicine repository method:', error);
        throw error;
    }
}

  

}


export default MedicineRepository;