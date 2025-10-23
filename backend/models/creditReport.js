
const mongoose = require('mongoose');

const creditAccountSchema = new mongoose.Schema({
  creditCardType: String,
  bankName: String,              
  address: String,               
  accountNumber: String,          
  amountOverdue: Number,  
  currentBalance: Number,        
}, { _id: false });

const creditReportSchema = new mongoose.Schema({
  name: { type: String, required: true },          
  mobilePhone: String,                             // Mobile Phone
  pan: String,                                     // PAN
  creditScore: Number,                             // Credit Score
  
  totalAccounts: Number,                           // Total number of accounts
  activeAccounts: Number,                          // Active accounts
  closedAccounts: Number,                          // Closed accounts
  currentBalanceAmount: Number,                    // Current balance amount
  securedAccountsAmount: Number,                   // Secured accounts amount
  unsecuredAccountsAmount: Number,                 // Unsecured accounts amount
  last7DaysEnquiries: Number,                      // Last 7 days credit enquiries
  
  creditAccounts: [creditAccountSchema],          
  
  xmlFileName: String,
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });
creditReportSchema.index({ pan: 1 });
creditReportSchema.index({ mobilePhone: 1 });
creditReportSchema.index({ uploadedAt: -1 });

module.exports = mongoose.model('CreditReport', creditReportSchema);