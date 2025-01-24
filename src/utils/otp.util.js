import axios from 'axios';
import { FAST2SMS, DLT_TEMPLATE_ID } from '../config/config.js';

export const generateOTP = (otp_length) => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};


export const sendSms = async (phone, message) => {
  const url = `http://182.18.182.46/vendorsms/pushsms.aspx`;
  const params = {
      user: 'Ameri',
      password: 'ameri123',
      msisdn: phone,
      sid: 'ASWORD',
      msg: message,
      fl: 0,
      gwid: 2
  };

  try {
      const response = await axios.get(url, { params, timeout: 10000 });
      console.log('SMS sent successfully:', response.data);
  } catch (error) {
      if (error.response) {
          // Request made and server responded
          console.error('Error response:', error.response.data);
      } else if (error.request) {
          // Request made but no response received
          console.error('No response received:', error.request);
      } else {
          // Something happened in setting up the request
          console.error('Error setting up request:', error.message);
      }
  }
};

// Example usage
// sendSms('7283080967', 'Your OTP is 443748');