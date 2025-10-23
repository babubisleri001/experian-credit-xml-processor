# Experian Credit XML Processor

A comprehensive web application for processing and managing Experian credit report XML files. This application provides a complete solution for uploading, parsing, storing, and visualizing credit report data with a modern, responsive user interface.

## Features

### Backend Features
- **XML File Upload**: RESTful API endpoint for secure XML file uploads
- **Data Extraction**: Automatic parsing and extraction of credit report data
- **MongoDB Integration**: Robust data persistence with well-designed schema
- **Error Handling**: Comprehensive error handling and logging
- **File Validation**: XML format validation and file size limits

### Frontend Features
- **Modern Dashboard**: Clean, intuitive interface with statistics cards
- **Advanced Search**: Real-time search across names, PAN numbers, and phone numbers
- **Drag & Drop Upload**: User-friendly file upload with progress indicators
- **Detailed Reports**: Comprehensive report viewing with data visualization
- **Analytics Dashboard**: Credit score distribution, risk analysis, and insights
- **Responsive Design**: Mobile-first design that works on all devices
- **Delete Functionality**: Safe report deletion with confirmation dialogs

### Data Extracted
- **Basic Details**: Name, Mobile Phone, PAN, Credit Score
- **Report Summary**: Total accounts, Active accounts, Closed accounts, Current balance, Secured/Unsecured amounts, Recent enquiries
- **Credit Accounts**: Credit cards, Bank names, Account numbers, Current balance, Amount overdue

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Multer** - File upload handling
- **XML2JS** - XML parsing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Toastify** - Notifications

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/experian-credit-xml-processor.git
cd experian-credit-xml-processor
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/credit-reports
PORT=5000
NODE_ENV=development
MAX_FILE_SIZE=5242880
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows
net start MongoDB

# On macOS/Linux
sudo systemctl start mongod
```

## Running the Application

##  API Endpoints

### Reports
- `POST /api/reports/upload` - Upload XML file
- `GET /api/reports` - Get all reports
- `GET /api/reports/:id` - Get report by ID
- `GET /api/reports/search/pan/:pan` - Search by PAN
- `GET /api/reports/search/phone/:phone` - Search by phone
- `GET /api/reports/stats/overview` - Get statistics
- `DELETE /api/reports/:id` - Delete report

### Health Check
- `GET /health` - Server health status

##  Database Schema

### Report Model
```javascript
{
  basicDetails: {
    name: String,
    mobilePhone: String,
    pan: String,
    creditScore: Number
  },
  reportSummary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalanceAmount: Number,
    securedAccountsAmount: Number,
    unsecuredAccountsAmount: Number,
    last7DaysEnquiries: Number
  },
  creditAccounts: [{
    bankName: String,
    creditCardType: String,
    accountNumber: String,
    currentBalance: Number,
    amountOverdue: Number
  }],
  createdAt: Date,
  updatedAt: Date
}
```



## Performance Optimizations

- React Query for efficient data caching
- Lazy loading of components
- Optimized re-renders with useMemo
- Responsive image handling
- Efficient database queries

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request


---
