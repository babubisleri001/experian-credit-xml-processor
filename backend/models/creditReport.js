
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
  name: { type: String, required: true,
    
   },          
  mobilePhone: String,                            
  pan: String,                                    
  creditScore: Number,                            
  
  totalAccounts: Number,                          
  activeAccounts: Number,                         
  closedAccounts: Number,                          
  currentBalanceAmount: Number,                   
  securedAccountsAmount: Number,            
  unsecuredAccountsAmount: Number,            
  last7DaysEnquiries: Number,                    
  
  creditAccounts: [creditAccountSchema],          
  
  xmlFileName: String,
  uploadedAt: { type: Date, default: Date.now },
}, { timestamps: true });
creditReportSchema.index({ pan: 1 });
creditReportSchema.index({ mobilePhone: 1 });
creditReportSchema.index({ uploadedAt: -1 });

module.exports = mongoose.model('CreditReport', creditReportSchema);