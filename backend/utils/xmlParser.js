const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false });
const parseXMLBuffer = async (fileBuffer) => {
  try {
    const xmlContent = fileBuffer.toString('utf-8');
    const result = await parser.parseStringPromise(xmlContent);
    return result;
  } catch (error) {
    throw new Error(`XML Parsing Error: ${error.message}`);
  }
};
const extractBasicDetails = (parsedXML) => {
  try {
    const profile = parsedXML.INProfileResponse;
    const caisHolderDetails = profile?.CAIS_Account?.CAIS_Account_DETAILS?.CAIS_Holder_Details;
    const applicantDetails = profile?.Current_Application?.Current_Application_Details?.Current_Applicant_Details;
    const firstName = caisHolderDetails?.First_Name_Non_Normalized || applicantDetails?.First_Name || '';
    const lastName = caisHolderDetails?.Surname_Non_Normalized || applicantDetails?.Last_Name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    const mobilePhone = applicantDetails?.MobilePhoneNumber || caisHolderDetails?.Mobile_Telephone_Number || '';
    const pan = caisHolderDetails?.Income_TAX_PAN || applicantDetails?.IncomeTaxPan || '';
    
    const creditScore = parseInt(profile?.SCORE?.BureauScore) || 0;
    
    return {
      name: fullName,
      mobilePhone: mobilePhone,
      pan: pan,
      creditScore: creditScore,
    };
  } catch (error) {
    console.error('Error extracting basic details:', error);
    return {
      name: '',
      mobilePhone: '',
      pan: '',
      creditScore: 'error',
    };
  }
};
const extractReportSummary = (parsedXML) => {
  try {
    const profile = parsedXML.INProfileResponse;
    const caisSummary = profile?.CAIS_Account?.CAIS_Summary;
    const creditAccount = caisSummary?.Credit_Account;
    const balanceSummary = caisSummary?.Total_Outstanding_Balance;
    const caps = profile?.TotalCAPS_Summary;
    
    return {
      totalAccounts: parseInt(creditAccount?.CreditAccountTotal) || 0,
      activeAccounts: parseInt(creditAccount?.CreditAccountActive) || 0,
      closedAccounts: parseInt(creditAccount?.CreditAccountClosed) || 0,
      currentBalanceAmount: parseInt(balanceSummary?.Outstanding_Balance_All) || 0,
      securedAccountsAmount: parseInt(balanceSummary?.Outstanding_Balance_Secured) || 0,
      unsecuredAccountsAmount: parseInt(balanceSummary?.Outstanding_Balance_UnSecured) || 0,
      last7DaysEnquiries: parseInt(caps?.TotalCAPSLast7Days) || 0,
    };
  } catch (error) {
    console.error('Error extracting report summary:', error);
    return {
      totalAccounts: 0,
      activeAccounts: 0,
      closedAccounts: 0,
      currentBalanceAmount: 0,
      securedAccountsAmount: 0,
      unsecuredAccountsAmount: 0,
      last7DaysEnquiries: 0,
    };
  }
};


const extractCreditAccounts = (parsedXML) => {
  try {
    const caisDetails = parsedXML.INProfileResponse?.CAIS_Account?.CAIS_Account_DETAILS;
    if (!caisDetails) return [];
    const accountsArray = Array.isArray(caisDetails) ? caisDetails : [caisDetails];
    return accountsArray.map(account => {
      const address = account?.CAIS_Holder_Address_Details;
      const addressParts = [
        address?.First_Line_Of_Address_non_normalized,
        address?.Second_Line_Of_Address_non_normalized,
        address?.Third_Line_Of_Address_non_normalized,
        address?.City_non_normalized,
        address?.State_non_normalized,
        address?.ZIP_Postal_Code_non_normalized,
      ].filter(Boolean);
      
      const fullAddress = addressParts.join(', ');
      
      return {
        creditCardType: account?.Account_Type || '',
        bankName: account?.Subscriber_Name?.trim() || '', 
        address: fullAddress,
        accountNumber: account?.Account_Number || '',
        amountOverdue: parseInt(account?.Amount_Past_Due) || 0,
        currentBalance: parseInt(account?.Current_Balance) || 0,
      };
    });
  } catch (error) {
    console.error('Error extracting credit accounts:', error);
    return [];
  }
};
const extractCreditReportData = async (fileBuffer, fileName) => {
  try {
    const parsedXML = await parseXMLBuffer(fileBuffer);
    
    const basicDetails = extractBasicDetails(parsedXML);
    const reportSummary = extractReportSummary(parsedXML);
    const creditAccounts = extractCreditAccounts(parsedXML);
    
    const reportData = {
      name: basicDetails.name,
      mobilePhone: basicDetails.mobilePhone,
      pan: basicDetails.pan,
      creditScore: basicDetails.creditScore,
      
      totalAccounts: reportSummary.totalAccounts,
      activeAccounts: reportSummary.activeAccounts,
      closedAccounts: reportSummary.closedAccounts,
      currentBalanceAmount: reportSummary.currentBalanceAmount,
      securedAccountsAmount: reportSummary.securedAccountsAmount,
      unsecuredAccountsAmount: reportSummary.unsecuredAccountsAmount,
      last7DaysEnquiries: reportSummary.last7DaysEnquiries,
      
      creditAccounts: creditAccounts,
      
      xmlFileName: fileName,
    };
    
    return reportData;
  } catch (error) {
    throw new Error(`Failed to extract credit report data: ${error.message}`);
  }
};

module.exports = {
  parseXMLBuffer,
  extractCreditReportData,
  extractBasicDetails,
  extractReportSummary,
  extractCreditAccounts,
};