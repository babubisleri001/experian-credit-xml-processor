import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as MoneyIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { getReportById } from '../services/api';

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: report, isLoading, error } = useQuery({ 
    queryKey: ['report', id], 
    queryFn: () => getReportById(id) 
  });

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
        Error loading report: {error.message}
      </Alert>
    );
  }

  const getCreditScoreColor = (score) => {
    if (score >= 750) return 'success';
    if (score >= 650) return 'warning';
    return 'error';
  };

  const getCreditScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Credit Report Details
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Basic Details Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                  Personal Information
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Full Name" 
                    secondary={
                      <Typography variant="body1" fontWeight="medium">
                        {report.basicDetails?.name || report.name || 'N/A'}
                      </Typography>
                    } 
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Mobile Number" 
                    secondary={
                      <Box display="flex" alignItems="center">
                        <PhoneIcon sx={{ mr: 1, fontSize: 16 }} />
                        <Typography variant="body1">
                          {report.basicDetails?.mobilePhone || report.mobilePhone || 'N/A'}
                        </Typography>
                      </Box>
                    } 
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="PAN Number" 
                    secondary={
                      <Typography variant="body1" fontFamily="monospace">
                        {report.basicDetails?.pan || report.pan || 'N/A'}
                      </Typography>
                    } 
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Credit Score" 
                    secondary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={`${report.basicDetails?.creditScore || report.creditScore || 'N/A'}`}
                          color={getCreditScoreColor(report.basicDetails?.creditScore || report.creditScore)}
                          size="small"
                        />
                        <Typography variant="caption" color="textSecondary">
                          ({getCreditScoreLabel(report.basicDetails?.creditScore || report.creditScore)})
                        </Typography>
                      </Box>
                    } 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Report Summary Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">Total Accounts</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {report.reportSummary?.totalAccounts || report.totalAccounts || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                    <Typography variant="h6">Active Accounts</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {report.reportSummary?.activeAccounts || report.activeAccounts || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <MoneyIcon color="info" sx={{ mr: 1 }} />
                    <Typography variant="h6">Current Balance</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    {formatCurrency(report.reportSummary?.currentBalanceAmount || report.currentBalanceAmount)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TrendingUpIcon color="warning" sx={{ mr: 1 }} />
                    <Typography variant="h6">Recent Enquiries</Typography>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {report.reportSummary?.last7DaysEnquiries || report.last7DaysEnquiries || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Additional Summary Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Detailed Summary
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Closed Accounts
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {report.reportSummary?.closedAccounts || report.closedAccounts || 0}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Secured Amount
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {formatCurrency(report.reportSummary?.securedAccountsAmount || report.securedAccountsAmount)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Unsecured Amount
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {formatCurrency(report.reportSummary?.unsecuredAccountsAmount || report.unsecuredAccountsAmount)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      Report Date
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {formatDate(report.createdAt || report.uploadedAt)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Credit Accounts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CreditCardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Credit Accounts ({report.creditAccounts?.length || 0})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {report.creditAccounts && report.creditAccounts.length > 0 ? (
                <Grid container spacing={2}>
                  {report.creditAccounts.map((account, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Paper sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="h6" fontWeight="bold">
                            {account.bankName || 'Unknown Bank'}
                          </Typography>
                          <Chip 
                            label={account.creditCardType || 'Credit Card'} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                          Account: {account.accountNumber || 'N/A'}
                        </Typography>
                        
                        <Box display="flex" justifyContent="space-between" mt={2}>
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              Current Balance
                            </Typography>
                            <Typography variant="h6" color="info.main" fontWeight="bold">
                              {formatCurrency(account.currentBalance)}
                            </Typography>
                          </Box>
                          <Box textAlign="right">
                            <Typography variant="caption" color="textSecondary">
                              Amount Overdue
                            </Typography>
                            <Typography 
                              variant="h6" 
                              color={account.amountOverdue > 0 ? 'error.main' : 'success.main'} 
                              fontWeight="bold"
                            >
                              {formatCurrency(account.amountOverdue)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        {account.amountOverdue > 0 && (
                          <Box mt={1}>
                            <Alert severity="warning" size="small">
                              <Typography variant="caption">
                                This account has overdue amount
                              </Typography>
                            </Alert>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box textAlign="center" py={4}>
                  <CreditCardIcon sx={{ fontSize: 64, color: 'textSecondary', mb: 2 }} />
                  <Typography variant="h6" color="textSecondary">
                    No credit accounts found
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportDetail;
