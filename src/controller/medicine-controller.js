import MedicineService from '../services/medicine-service.js';

const medicineService = new MedicineService();

export const get = async (req, res) => {
  try {
    const medicine = await medicineService.getMedicine(req.params.id);
    return res.status(200).json({
      data: medicine,
      success: true,
      message: 'Successfully fetched the medicine',
      error: null,
    });
  } catch (error) {
    console.error('Error in get controller method:', error);
    return res.status(500).json({
      data: null,
      success: false,
      message: 'Failed to fetch the medicine',
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const medicines = await medicineService.getAllMedicines();
    return res.status(200).json({
      data: medicines,
      success: true,
      message: 'Successfully fetched all medicines',
      error: null,
    });
  } catch (error) {
    console.error('Error in getAll controller method:', error);
    return res.status(500).json({
      data: null,
      success: false,
      message: 'Failed to fetch all medicines',
      error: error.message,
    });
  }
};

export const createMedicine = async (req, res) => {
  try {
    const medicineData = {
      ...req.body,
      DISCOUNT: req.body.DISCOUNT || 0,
    };
    const newMedicine = await medicineService.createMedicine(medicineData);
    return res.status(201).json({
      data: newMedicine,
      success: true,
      message: 'Successfully created the medicine',
      error: null,
    });
  } catch (error) {
    console.error('Error in createMedicine controller method:', error);
    return res.status(500).json({
      data: null,
      success: false,
      message: 'Failed to create the medicine',
      error: error.message,
    });
  }
};

export const deleteMedicine = async (req, res) => {
  try {
    const result = await medicineService.deleteMedicine(req.params.id);
    return res.status(200).json({
      data: result,
      success: true,
      message: 'Successfully deleted the medicine',
      error: null,
    });
  } catch (error) {
    console.error('Error in deleteMedicine controller method:', error);
    return res.status(500).json({
      data: null,
      success: false,
      message: 'Failed to delete the medicine',
      error: error.message,
    });
  }
};

export const updateMedicine = async (req, res) => {
  try {
    const updatedMedicine = await medicineService.updateMedicine(
      req.params.id,
      req.body
    );
    return res.status(200).json({
      data: updatedMedicine,
      success: true,
      message: 'Successfully updated the medicine',
      error: null,
    });
  } catch (error) {
    console.error('Error in updateMedicine controller method:', error);
    return res.status(500).json({
      data: null,
      success: false,
      message: 'Failed to update the medicine',
      error: error.message,
    });
  }
};

export const getMedicinesByManufacturer = async (req, res) => {
  try {
    const { manufacturer}= req.params;
    console.log("amalhf",manufacturer)
    const medicines = await medicineService.getMedicinesByManufacturer(
        manufacturer
    );
    return res.status(200).json({
      data: medicines,
      success: true,
      message: `Successfully fetched medicines by manufacturer: ${manufacturer}`,
      error: null,
    });
  } catch (error) {
    console.error(
      'Error in getMedicinesByManufacturer controller method:',
      error
    );
    return res.status(500).json({
      data: null,
      success: false,
      message: 'Failed to fetch medicines by manufacturer',
      error: error.message,
    });
  }
};

export const updateDiscountAndPriceByManufacturer = async (req, res) => {
    try {
      const { manufacturer } = req.params;
      const { DISCOUNT } = req.body;
      console.log("discount in controller",DISCOUNT)
      
      const result = await medicineService.updateDiscountAndPriceByManufacturer(manufacturer, DISCOUNT);
      
      return res.status(200).json({
        data: result,
        success: true,
        message: result.message,
        error: null,
      });
    } catch (error) {
      console.error('Error in updateDiscountAndPriceByManufacturer controller method:', error);
      return res.status(500).json({
        data: null,
        success: false,
        message: 'Failed to update discount and price for manufacturer',
        error: error.message,
      });
    }
  };

export const insertManyMedicines = async (req, res) => {
    try {
      const medicinesData = req.body;
      const result = await medicineService.insertManyMedicines(medicinesData);
      return res.status(201).json({
        data: result,
        success: true,
        message: 'Successfully inserted many medicines',
        error: null,
      });
    } catch (error) {
      console.error('Error in insertManyMedicines controller method:', error);
      return res.status(500).json({
        data: null,
        success: false,
        message: 'Failed to insert many medicines',
        error: error.message,
      });
    }
  };

  export const search = async (req, res) => {
    console.log(req.query);
    try {
      const {query} = req.query;
      const result = await medicineService.searchMedicines(query);
      return res.status(200).json({
        data: result,
        success: true,
        message: 'Successfully fetched search results',
        error: null,
      });
    } catch (error) {
      console.error('Error in search controller method:', error);
      return res.status(500).json({
        data: null,
        success: false,
        message: 'Failed to fetch search results',
        error: error.message,
      });
    }
  };
  export const getManufacturersByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      console.log("gahh",category)
      const manufacturers = await medicineService.getManufacturersByCategory(category);
      console.log("manufacturer",manufacturers)
      return res.status(200).json({
        data: manufacturers,
        success: true,
        message: `Successfully fetched manufacturers for category: ${category}`,
        error: null,
      });
    } catch (error) {
      console.error('Error in getManufacturersByCategory controller method:', error);
      return res.status(500).json({
        data: null,
        success: false,
        message: 'Failed to fetch manufacturers for category',
        error: error.message,
      });
    }
  };