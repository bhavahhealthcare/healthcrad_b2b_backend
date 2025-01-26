import UserRepository from "../repository/user-repository.js";
import { PHONE_NOT_FOUND_ERR, PHONE_ALREADY_EXISTS_ERR, USER_NOT_FOUND_ERR, INCORRECT_OTP_ERR } from "../error/error.js";
import { generateOTP, sendSms } from "../utils/otp.util.js";
import { createJwtToken } from "../utils/token.util.js";
import User from "../models/user.js";
class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async createNewUser(data) {
    const {
      phone
    } = data;

    // Check if phone number already exists
    const phoneExist = await this.userRepository.findOne({
      phone
    });
    if (phoneExist) {
      throw {
        status: 400,
        message: PHONE_ALREADY_EXISTS_ERR
      };
    }

    // Create user without OTP initially
    const user = await this.userRepository.create(data);
    return user;
  }
  async sendOTP(phone) {
    const user = await this.userRepository.findOne({
      phone
    });
    if (!user) {
      throw {
        status: 404,
        message: USER_NOT_FOUND_ERR
      };
    }
    const otp = generateOTP(6);
    user.phoneOtp = otp;
    await this.userRepository.save(user);
    await sendSms({
      message: `Your OTP is ${otp}`,
      contactNumber: user.phone
    });
    return otp;
  }
  async loginWithPhoneOtp(phone) {
    const user = await this.userRepository.findOne({
      phone
    });
    if (!user) {
      throw {
        status: 400,
        message: PHONE_NOT_FOUND_ERR
      };
    }
    const otp = generateOTP(6);
    user.phoneOtp = otp;
    await this.userRepository.save(user);
    await sendSms({
      message: `Your OTP is ${otp}`,
      contactNumber: phone
    });
    return {
      user
    };
  }
  async verifyPhoneOtp(data) {
    const {
      otp,
      phone
    } = data;
    const user = await this.userRepository.findByPhone(phone);
    if (!user) {
      throw {
        status: 400,
        message: USER_NOT_FOUND_ERR
      };
    }
    if (user.phoneOtp === otp) {
      const token = createJwtToken({
        userId: user._id
      });
      user.phoneOtp = "";
      await this.userRepository.save(user);
      return {
        token,
        userId: user._id
      };
    } else {
      throw {
        status: 400,
        message: INCORRECT_OTP_ERR
      };
    }
  }
  async fetchCurrentUser(userId) {
    console.log(`userId: ${userId}`);
    try {
      const user = await User.findById(userId);
      console.log(user);
      if (!user) {
        throw {
          status: 400,
          message: USER_NOT_FOUND_ERR
        };
      }
      return user;
    } catch (error) {
      throw new Error(`Error Finding user: ${error.message}`);
    }
  }
  async deleteUserById(id) {
    try {
      const deletedUser = await this.userRepository.deleteById(id);
      return deletedUser;
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
  async updateUserById(id, updateData) {
    try {
      return await this.userRepository.updateById(id, updateData);
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
  async addAddress(userId, addressData) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.addresses.push(addressData);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Error adding address: ${error.message}`);
    }
  }
  async updateAddress(userId, addressId, addressData) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const addressIndex = user.addresses.findIndex(address => address._id.toString() === addressId);
      if (addressIndex === -1) {
        throw new Error("Address not found");
      }
      user.addresses[addressIndex] = {
        ...user.addresses[addressIndex],
        ...addressData
      };
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Error updating address: ${error.message}`);
    }
  }
  async deleteAddress(userId, addressId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      user.addresses = user.addresses.filter(address => address._id.toString() !== addressId);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new Error(`Error deleting address: ${error.message}`);
    }
  }
}
export default UserService;