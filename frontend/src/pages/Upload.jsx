import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  LinearProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Close as CloseIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { uploadReport } from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.xml')) {
        toast.error('Please upload an XML file');
        return;
      }
      
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await uploadReport(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setTimeout(() => {
        toast.success('Report uploaded and processed successfully!');
        navigate('/');
      }, 500);
      
    } catch (error) {
      clearInterval(progressInterval);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        Upload Credit Report
      </Typography>
      
      <Typography variant="body1" color="textSecondary" paragraph>
        Upload an XML file containing credit report data. The file will be processed and stored in the system.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3,
              border: dragActive ? '2px dashed #1976d2' : '2px dashed #e0e0e0',
              backgroundColor: dragActive ? '#f5f5f5' : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#1976d2',
                backgroundColor: '#f5f5f5'
              }
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".xml"
              onChange={(e) => handleFileChange(e.target.files[0])}
              style={{ display: 'none' }}
            />
            
            <Box textAlign="center" py={4}>
              <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {dragActive ? 'Drop your XML file here' : 'Drag & drop your XML file here'}
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                or click to browse files
              </Typography>
              <Button variant="outlined" startIcon={<FileIcon />}>
                Choose File
              </Button>
            </Box>
          </Paper>

          {file && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <DescriptionIcon color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {file.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip 
                      label="XML" 
                      color="primary" 
                      size="small" 
                      variant="outlined" 
                    />
                    <IconButton onClick={removeFile} size="small">
                      <CloseIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {isUploading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                Uploading and processing file...
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="textSecondary">
                {uploadProgress}% complete
              </Typography>
            </Box>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={!file || isUploading}
              startIcon={isUploading ? <LinearProgress size={20} /> : <CloudUploadIcon />}
              size="large"
            >
              {isUploading ? 'Uploading...' : 'Upload Report'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upload Guidelines
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Supported Format
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Only XML files are supported
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                File Size Limit
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Maximum file size: 5MB
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom>
                <CheckCircleIcon color="success" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Data Extraction
              </Typography>
              <Typography variant="body2" color="textSecondary">
                The system will automatically extract and process credit report data
              </Typography>
            </Box>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Make sure your XML file contains valid credit report data in the expected format.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Upload;
