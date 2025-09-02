import React, { useState, useEffect } from 'react';

function CallManagement() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate API call to fetch calls
    const fetchCalls = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockCalls = [
          {
            id: 1,
            customerName: 'John Doe',
            phoneNumber: '+91-9876543210',
            status: 'completed',
            duration: '2:45',
            timestamp: '2024-01-15 14:30:00',
            outcome: 'Payment promised',
            amount: '₹15,000',
            attempts: 1
          },
          {
            id: 2,
            customerName: 'Jane Smith',
            phoneNumber: '+91-9876543211',
            status: 'failed',
            duration: '0:15',
            timestamp: '2024-01-15 14:25:00',
            outcome: 'No answer',
            amount: '₹8,500',
            attempts: 3
          },
          {
            id: 3,
            customerName: 'Bob Johnson',
            phoneNumber: '+91-9876543212',
            status: 'completed',
            duration: '4:20',
            timestamp: '2024-01-15 14:20:00',
            outcome: 'Dispute raised',
            amount: '₹22,000',
            attempts: 2
          },
          {
            id: 4,
            customerName: 'Alice Brown',
            phoneNumber: '+91-9876543213',
            status: 'in-progress',
            duration: '1:30',
            timestamp: '2024-01-15 14:15:00',
            outcome: 'In conversation',
            amount: '₹12,750',
            attempts: 1
          },
          {
            id: 5,
            customerName: 'Charlie Wilson',
            phoneNumber: '+91-9876543214',
            status: 'pending',
            duration: '-',
            timestamp: '2024-01-15 14:10:00',
            outcome: 'Scheduled',
            amount: '₹9,200',
            attempts: 0
          }
        ];
        
        setCalls(mockCalls);
      } catch (error) {
        console.error('Error fetching calls:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'bg-success',
      failed: 'bg-danger',
      pending: 'bg-warning',
      'in-progress': 'bg-primary'
    };
    
    return `badge ${statusClasses[status] || 'bg-secondary'}`;
  };

  const filteredCalls = calls.filter(call => {
    const matchesFilter = filter === 'all' || call.status === filter;
    const matchesSearch = call.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.phoneNumber.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const handleRetryCall = (callId) => {
    // Simulate retry call
    setCalls(prevCalls => 
      prevCalls.map(call => 
        call.id === callId 
          ? { ...call, status: 'pending', attempts: call.attempts + 1 }
          : call
      )
    );
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-phone me-2"></i>
          Call Management
        </h1>
        <button className="btn btn-primary">
          <i className="fas fa-play me-2"></i>
          Start Campaign
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name or phone number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Calls</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Calls Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-list me-2"></i>
            Call Records ({filteredCalls.length})
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Attempts</th>
                  <th>Outcome</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCalls.map(call => (
                  <tr key={call.id}>
                    <td>
                      <strong>{call.customerName}</strong>
                    </td>
                    <td>{call.phoneNumber}</td>
                    <td>{call.amount}</td>
                    <td>
                      <span className={getStatusBadge(call.status)}>
                        {call.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>{call.duration}</td>
                    <td>
                      <span className="badge bg-secondary">{call.attempts}</span>
                    </td>
                    <td>{call.outcome}</td>
                    <td>
                      <small className="text-muted">
                        {new Date(call.timestamp).toLocaleString()}
                      </small>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        {call.status === 'failed' && (
                          <button 
                            className="btn btn-outline-primary"
                            onClick={() => handleRetryCall(call.id)}
                            title="Retry Call"
                          >
                            <i className="fas fa-redo"></i>
                          </button>
                        )}
                        <button 
                          className="btn btn-outline-info"
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-secondary"
                          title="Download Recording"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CallManagement;
