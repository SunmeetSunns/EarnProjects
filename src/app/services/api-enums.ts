// src/app/constants/api-constants.ts

export const Api = {
  signup: 'api/auth/complete-signup',
  login: 'api/auth/login',
  verifyOtp: 'api/auth/verify-otp',
  getUser: 'api/admin/user',
  sendOtp:'api/auth/send-otp',
  getCategorylans:'api/user/get-category-wise-plans',
  savePrefference:'api/user/save-prefference',
  forgotPass:'api/auth/forgot-password',
  changePassword:'api/auth/reset-password',
  talkToExpert:'api/auth/talk-to-expert',
  createPayment:'api/payment/create-order',
  verifyPayment:'api/payment/verify-payment',
  saveUserPlan:'api/user/saveUserPlan',
  findPlan:'api/user/findPlan',
  getUserDetails:'api/user/getUserDetails',
  saveBankDetails:'api/user/saveBankDetails',
  getBankDetails:'api/user/getBankDetails',
  updateEmail:'api/auth/updateEmail',
  updateUserFields:'api/auth/update-user-details',
  uploadUserFiles: (userId: string) => `api/auth/${userId}/upload-files`,
  
  // Add more endpoints as needed
};
