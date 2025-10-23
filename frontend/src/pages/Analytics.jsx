import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  CircularProgress,
  Alert,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  Assessment as AssessmentIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { getAllReports } from '../services/api';

const Analytics = () => {
  const { data: reports, isLoading, error } = useQuery({ 
    queryKey: ['reports'], 
    queryFn: getAllReports 
  });

  const analytics = useMemo(() => {
    if (!reports || reports.length === 0) {
      return {
        totalReports: 0,
        avgCreditScore: 0,
        totalBalance: 0,
        totalAccounts: 0,
        creditScoreDistribution: { excellent: 0, good: 0, fair: 0, poor: 0 },
        topBanks: [],
        recentTrends: [],
        riskAnalysis: { high: 0, medium: 0, low: 0 },
      };
    }
    const totalReports = reports.length;
    const totalScore = reports.reduce((sum, report) => {
      const score = report.basicDetails?.creditScore || report.creditScore || 0;
      return sum + (typeof score === 'number' ? score : parseInt(score) || 0);
    }, 0);
    const avgCreditScore = Math.round(totalScore / totalReports);
    const totalBalance = reports.reduce((sum, report) => {
      const balance = report.reportSummary?.currentBalanceAmount || report.currentBalanceAmount || 0;
      return sum + (typeof balance === 'number' ? balance : parseFloat(balance) || 0);
    }, 0);
    const totalAccounts = reports.reduce((sum, report) => {
      const accounts = report.reportSummary?.totalAccounts || report.totalAccounts || 0;
      return sum + (typeof accounts === 'number' ? accounts : parseInt(accounts) || 0);
    }, 0);

    const creditScoreDistribution = reports.reduce((dist, report) => {
      const score = report.basicDetails?.creditScore || report.creditScore || 0;
      if (score >= 750) dist.excellent++;
      else if (score >= 650) dist.good++;
      else if (score >= 550) dist.fair++;
      else dist.poor++;
      return dist;
    }, { excellent: 0, good: 0, fair: 0, poor: 0 });

    const bankCounts = {};
    reports.forEach(report => {
      if (report.creditAccounts) {
        report.creditAccounts.forEach(account => {
          const bankName = account.bankName || 'Unknown Bank';
          bankCounts[bankName] = (bankCounts[bankName] || 0) + 1;
        });
      }
    });
    const topBanks = Object.entries(bankCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([bank, count]) => ({ bank, count }));

    const riskAnalysis = reports.reduce((risk, report) => {
      const score = report.basicDetails?.creditScore || report.creditScore || 0;
      const overdue = report.creditAccounts?.some(acc => acc.amountOverdue > 0) || false;
      
      if (score < 550 || overdue) risk.high++;
      else if (score < 650) risk.medium++;
      else risk.low++;
      
      return risk;
    }, { high: 0, medium: 0, low: 0 });

    return {
      totalReports,
      avgCreditScore,
      totalBalance,
      totalAccounts,
      creditScoreDistribution,
      topBanks,
      riskAnalysis,
    };
  }, [reports]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getPercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading analytics: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Analytics Dashboard
      </Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        Comprehensive insights and statistics from all credit reports
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <PeopleIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Reports
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold">
                    {analytics.totalReports}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUpIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Avg Credit Score
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color="success.main">
                    {analytics.avgCreditScore}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <MoneyIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Balance
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color="info.main">
                    {formatCurrency(analytics.totalBalance)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <AccountBalanceIcon color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Accounts
                  </Typography>
                  <Typography variant="h4" component="div" fontWeight="bold" color="secondary.main">
                    {analytics.totalAccounts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Credit Score Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Credit Score Distribution
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Excellent (750+)</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.creditScoreDistribution.excellent} ({getPercentage(analytics.creditScoreDistribution.excellent, analytics.totalReports)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getPercentage(analytics.creditScoreDistribution.excellent, analytics.totalReports)}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Good (650-749)</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.creditScoreDistribution.good} ({getPercentage(analytics.creditScoreDistribution.good, analytics.totalReports)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getPercentage(analytics.creditScoreDistribution.good, analytics.totalReports)}
                  color="info"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Fair (550-649)</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.creditScoreDistribution.fair} ({getPercentage(analytics.creditScoreDistribution.fair, analytics.totalReports)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getPercentage(analytics.creditScoreDistribution.fair, analytics.totalReports)}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Poor (&lt;550)</Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.creditScoreDistribution.poor} ({getPercentage(analytics.creditScoreDistribution.poor, analytics.totalReports)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getPercentage(analytics.creditScoreDistribution.poor, analytics.totalReports)}
                  color="error"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Risk Analysis
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Chip label="High Risk" color="error" size="small" sx={{ mr: 1 }} />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.riskAnalysis.high} ({getPercentage(analytics.riskAnalysis.high, analytics.totalReports)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getPercentage(analytics.riskAnalysis.high, analytics.totalReports)}
                  color="error"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box mb={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Chip label="Medium Risk" color="warning" size="small" sx={{ mr: 1 }} />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.riskAnalysis.medium} ({getPercentage(analytics.riskAnalysis.medium, analytics.totalReports)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getPercentage(analytics.riskAnalysis.medium, analytics.totalReports)}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Box display="flex" alignItems="center">
                    <Chip label="Low Risk" color="success" size="small" sx={{ mr: 1 }} />
                  </Box>
                  <Typography variant="body2" fontWeight="bold">
                    {analytics.riskAnalysis.low} ({getPercentage(analytics.riskAnalysis.low, analytics.totalReports)}%)
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={getPercentage(analytics.riskAnalysis.low, analytics.totalReports)}
                  color="success"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Banks */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CreditCardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Top Banks by Account Count
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {analytics.topBanks.length > 0 ? (
                <List>
                  {analytics.topBanks.map((bank, index) => (
                    <ListItem key={bank.bank} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Chip 
                          label={index + 1} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </ListItemIcon>
                      <ListItemText 
                        primary={bank.bank}
                        secondary={`${bank.count} accounts`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="textSecondary" textAlign="center" py={2}>
                  No bank data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Summary Insights */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <TimelineIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Key Insights
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Average Credit Score"
                    secondary={`${analytics.avgCreditScore} - ${analytics.avgCreditScore >= 650 ? 'Above Average' : 'Below Average'}`}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <AccountBalanceIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Total Financial Exposure"
                    secondary={formatCurrency(analytics.totalBalance)}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <TrendingUpIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Credit Score Distribution"
                    secondary={`${getPercentage(analytics.creditScoreDistribution.excellent + analytics.creditScoreDistribution.good, analytics.totalReports)}% have good or excellent scores`}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Risk Assessment"
                    secondary={`${getPercentage(analytics.riskAnalysis.high, analytics.totalReports)}% are high risk`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;

