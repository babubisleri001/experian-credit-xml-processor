
const CreditReport = require('../models/creditReport');
const { extractCreditReportData } = require('../utils/xmlParser');


exports.uploadReport = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = req.file.originalname;
    
    if (!fileName.toLowerCase().endsWith('.xml')) {
      return res.status(400).json({ error: 'Only XML files are allowed' });
    }

    const reportData = await extractCreditReportData(req.file.buffer, fileName);

    const creditReport = new CreditReport(reportData);
    await creditReport.save();

    res.status(201).json({
      success: true,
      message: 'Report uploaded and processed successfully',
      data: creditReport,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await CreditReport.find()
      .sort({ uploadedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReportById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await CreditReport.findById(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getReportByPan = async (req, res, next) => {
  try {
    const { pan } = req.params;

    const report = await CreditReport.findOne({ pan })
      .sort({ uploadedAt: -1 });

    if (!report) {
      return res.status(404).json({ error: 'Report not found for given PAN' });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getReportByPhone = async (req, res, next) => {
  try {
    const { phone } = req.params;

    const report = await CreditReport.findOne({ mobilePhone: phone })
      .sort({ uploadedAt: -1 });

    if (!report) {
      return res.status(404).json({ error: 'Report not found for given phone number' });
    }

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await CreditReport.findByIdAndDelete(id);

    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully',
      data: report,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getReportStats = async (req, res, next) => {
  try {
    const stats = await CreditReport.aggregate([
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          avgCreditScore: { $avg: '$creditScore' },
          avgOutstandingBalance: { $avg: '$totalOutstandingBalance' },
        },
      },
    ]);

    res.json({
      success: true,
      data: stats[0] || {
        totalReports: 0,
        avgCreditScore: 0,
        avgOutstandingBalance: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};