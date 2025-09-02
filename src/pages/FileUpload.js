import React, { useState } from 'react';

function FileUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        setSelectedFile(file);
        setMessage('');
      } else {
        setMessage('Please select a valid Excel file (.xlsx or .xls)');
        setMessageType('error');
        setSelectedFile(null);
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
          file.type === 'application/vnd.ms-excel') {
        setSelectedFile(file);
        setMessage('');
      } else {
        setMessage('Please select a valid Excel file (.xlsx or .xls)');
        setMessageType('error');
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setMessage('');

    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API call to upload file
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setMessage(`File "${selectedFile.name}" uploaded successfully! Processing will begin shortly.`);
      setMessageType('success');
      setSelectedFile(null);
      
    } catch (error) {
      setMessage('Upload failed. Please try again.');
      setMessageType('error');
    } finally {
      setUploading(false);
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-upload me-2"></i>
          File Upload
        </h1>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-file-excel me-2"></i>
                Upload Customer Data
              </h5>
            </div>
            <div className="card-body">
              {message && (
                <div className={`alert ${messageType === 'error' ? 'alert-danger' : 'alert-success'}`}>
                  <i className={`fas ${messageType === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`}></i>
                  {message}
                </div>
              )}

              <div 
                className="upload-area mb-3"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <div className="text-center">
                  <i className="fas fa-cloud-upload-alt fa-3x mb-3 text-primary"></i>
                  <h4>Drop your Excel file here</h4>
                  <p className="text-muted">or click to browse</p>
                  <p className="small text-muted">
                    Supported formats: .xlsx, .xls (Max size: 10MB)
                  </p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  className="file-input"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                />
              </div>

              {selectedFile && (
                <div className="card bg-light mb-3">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <i className="fas fa-file-excel fa-2x text-success me-3"></i>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{selectedFile.name}</h6>
                        <small className="text-muted">
                          Size: {formatFileSize(selectedFile.size)} | 
                          Last modified: {new Date(selectedFile.lastModified).toLocaleDateString()}
                        </small>
                      </div>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {uploadProgress > 0 && (
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Upload Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="progress">
                    <div 
                      className="progress-bar progress-bar-striped progress-bar-animated" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="d-flex gap-2">
                <button 
                  className="btn btn-primary"
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload me-2"></i>
                      Upload File
                    </>
                  )}
                </button>
                
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => setSelectedFile(null)}
                  disabled={uploading}
                >
                  <i className="fas fa-times me-2"></i>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>
                File Requirements
              </h6>
            </div>
            <div className="card-body">
              <h6>Required Columns:</h6>
              <ul className="list-unstyled">
                <li><i className="fas fa-check text-success me-2"></i>Customer Name</li>
                <li><i className="fas fa-check text-success me-2"></i>Phone Number</li>
                <li><i className="fas fa-check text-success me-2"></i>Outstanding Amount</li>
                <li><i className="fas fa-check text-success me-2"></i>Due Date</li>
                <li><i className="fas fa-check text-success me-2"></i>Account Number</li>
              </ul>

              <h6 className="mt-3">Optional Columns:</h6>
              <ul className="list-unstyled">
                <li><i className="fas fa-circle text-muted me-2" style={{fontSize: '0.5rem'}}></i>Email Address</li>
                <li><i className="fas fa-circle text-muted me-2" style={{fontSize: '0.5rem'}}></i>Last Payment Date</li>
                <li><i className="fas fa-circle text-muted me-2" style={{fontSize: '0.5rem'}}></i>Customer Notes</li>
              </ul>

              <div className="mt-3">
                <a href="/sample-template.xlsx" className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-download me-2"></i>
                  Download Template
                </a>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="fas fa-history me-2"></i>
                Recent Uploads
              </h6>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">customers_jan_2024.xlsx</small>
                    <br />
                    <small className="text-success">✓ Processed successfully</small>
                  </div>
                  <small className="text-muted">2h ago</small>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted">debt_collection_data.xlsx</small>
                    <br />
                    <small className="text-warning">⚠ Processing...</small>
                  </div>
                  <small className="text-muted">4h ago</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
