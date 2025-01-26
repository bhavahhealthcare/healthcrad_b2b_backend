import MedicineRepository from '../repository/medicine-repository.js';
import { publishToQueue } from '../utils/notification.utils.js';
class MedicineService {
  constructor() {
    this.medicineRepository = new MedicineRepository();
  }
  async getMedicine(id) {
    try {
      const medicine = await this.medicineRepository.getMedicine(id);
      return medicine;
    } catch (error) {
      console.log('Error in getMedicine service method:', error);
      throw error;
    }
  }
  async getAllMedicines() {
    try {
      const medicines = await this.medicineRepository.getAllMedicines();
      return medicines;
    } catch (error) {
      console.log('Error in getAllMedicines service method:', error);
      throw error;
    }
  }
  async createMedicine(medicineData) {
    try {
      const newMedicine = await this.medicineRepository.createMedicine(medicineData);
      return newMedicine;
    } catch (error) {
      console.log('Error in createMedicine service method:', error);
      throw error;
    }
  }
  async deleteMedicine(id) {
    try {
      const result = await this.medicineRepository.deleteMedicine(id);
      return result;
    } catch (error) {
      console.log('Error in deleteMedicine service method:', error);
      throw error;
    }
  }
  async updateMedicine(id, medicineData) {
    try {
      const updatedMedicine = await this.medicineRepository.updateMedicine(id, medicineData);
      return updatedMedicine;
    } catch (error) {
      console.log('Error in updateMedicine service method:', error);
      throw error;
    }
  }
  async getMedicinesByManufacturer(manufacturer) {
    try {
      const medicines = await this.medicineRepository.getMedicinesByManufacturer(manufacturer);
      return medicines;
    } catch (error) {
      console.log('Error in getMedicinesByManufacturer service method:', error);
      throw error;
    }
  }
  async updateDiscountAndPriceByManufacturer(manufacturer, newDiscount) {
    try {
      const {
        result,
        previousDiscount
      } = await this.medicineRepository.updateDiscountByManufacturer(manufacturer, newDiscount);

      // Only send notification if new discount is higher
      if (newDiscount > previousDiscount) {
        const notification = {
          manufacturer,
          discount: newDiscount,
          message: `Hey! Now ${manufacturer} gives a discount of ${newDiscount}%`
        };
        await publishToQueue(notification);
      }
      const medicines = await this.medicineRepository.getMedicinesByManufacturer(manufacturer);
      const updatePricePromises = medicines.map(async medicine => {
        const mrp = parseFloat(medicine.MRP);
        if (isNaN(mrp) || isNaN(newDiscount)) {
          throw new Error(`Invalid MRP (${medicine.MRP}) or discount (${newDiscount}) for medicine: ${medicine._id}`);
        }
        let newPrice = mrp * (1 - newDiscount / 100);
        newPrice = Math.round(newPrice);
        await this.medicineRepository.updatePriceByMedicine(medicine._id, newPrice, newDiscount);
      });
      await Promise.all(updatePricePromises);
      return {
        result,
        message: `Successfully updated discount and prices for manufacturer: ${manufacturer}`
      };
    } catch (error) {
      console.error('Error in updateDiscountAndPriceByManufacturer service method:', error);
      throw error;
    }
  }
  async insertManyMedicines(medicinesData) {
    try {
      const result = await this.medicineRepository.insertManyMedicines(medicinesData);
      return result;
    } catch (error) {
      console.log('Error in insertManyMedicines service method:', error);
      throw error;
    }
  }
  async searchMedicines(query) {
    try {
      const result = await this.medicineRepository.searchMedicines(query);
      return result;
    } catch (error) {
      console.log('Error in searchMedicines service method:', error);
      throw error;
    }
  }
  async getManufacturersByCategory(category) {
    try {
      const manufacturers = await this.medicineRepository.getManufacturersByCategory(category);
      return manufacturers;
    } catch (error) {
      console.log('Error in getManufacturersByCategory service method:', error);
      throw error;
    }
  }
}
export default MedicineService;