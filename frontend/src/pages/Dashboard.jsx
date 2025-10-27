import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  Upload as UploadIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { getAllReports, deleteReport } from '../services/api';
import { toast } from 'react-toastify';
const Dashboard = () => {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, report: null });
  const queryClient = useQueryClient();
  const { data: reports, isLoading, error, refetch } = useQuery({ 
    queryKey: ['reports'], 
    queryFn: getAllReports 
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries(['reports']);
      toast.success('Report deleted successfully');
      setDeleteDialog({ open: false, report: null });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete report');
    },
  });
  const filteredReports = useMemo(() => {
    if (!reports || !searchTerm) return reports || [];
    
    const term = searchTerm.toLowerCase();
    return reports.filter(report => {
      const name = (report.basicDetails?.name || report.name || '').toLowerCase();
      const pan = (report.basicDetails?.pan || report.pan || '').toLowerCase();
      const phone = (report.basicDetails?.mobilePhone || report.mobilePhone || '').toLowerCase();
      
      return name.includes(term) || pan.includes(term) || phone.includes(term);
    });
  }, [reports, searchTerm]);
  const stats = useMemo(() => {
    if (!reports) return { total: 0, avgScore: 0, totalBalance: 0, totalAccounts: 0 };
    
    const total = reports.length;
    const avgScore = reports.reduce((sum, report) => {
      const score = report.basicDetails?.creditScore || report.creditScore || 0;
      return sum + (typeof score === 'number' ? score : parseInt(score) || 0);
    }, 0) / total;
    
    const totalBalance = reports.reduce((sum, report) => {
      const balance = report.reportSummary?.currentBalanceAmount || report.currentBalanceAmount || 0;
      return sum + (typeof balance === 'number' ? balance : parseFloat(balance) || 0);
    }, 0);
    
    const totalAccounts = reports.reduce((sum, report) => {
      const accounts = report.reportSummary?.totalAccounts || report.totalAccounts || 0;
      return sum + (typeof accounts === 'number' ? accounts : parseInt(accounts) || 0);
    }, 0);

    return { total, avgScore: Math.round(avgScore), totalBalance, totalAccounts };
  }, [reports]);

  const getCreditScoreColor = (score) => {
    if (score >= 750) return 'success';
    if (score >= 650) return 'warning';
    return 'error';
  };

  const handleDeleteClick = (report) => {
    setDeleteDialog({ open: true, report });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.report) {
      deleteMutation.mutate(deleteDialog.report._id);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, report: null });
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
        Error loading reports: {error.message}
      </Alert>
    );
  }

  return (
    <Box>
      {}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Credit Reports Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          component={Link}
          to="/upload"
          size="large"
        >
          Upload New Report
        </Button>
      </Box>

      {}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalanceIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Reports
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
  

        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUpIcon color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Avg Credit Score
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.avgScore}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CreditCardIcon color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Balance
                  </Typography>
                  <Typography variant="h4" component="div">
                    ₹{stats.totalBalance.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AccountBalanceIcon color="secondary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Accounts
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.totalAccounts}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, PAN, or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Paper>

      {/* Reports Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'primary.main' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>PAN</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Phone</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Credit Score</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Upload Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="h6" color="textSecondary">
                      {searchTerm ? 'No reports found matching your search' : 'No reports available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => {
                  const creditScore = report.basicDetails?.creditScore || report.creditScore;
                  return (
                    <TableRow key={report._id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {report.basicDetails?.name || report.name || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace">
                          {report.basicDetails?.pan || report.pan || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {report.basicDetails?.mobilePhone || report.mobilePhone || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={creditScore || 'N/A'}
                          color={getCreditScoreColor(creditScore)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(report.createdAt || report.uploadedAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton
                              component={Link}
                              to={`/report/${report._id}`}
                              size="small"
                              color="primary"
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Report">
                            <IconButton
                              onClick={() => handleDeleteClick(report)}
                              size="small"
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Credit Report
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the credit report for{' '}
            <strong>{deleteDialog.report?.basicDetails?.name || deleteDialog.report?.name}</strong>?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
