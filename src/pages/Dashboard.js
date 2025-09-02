import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    successfulCalls: 0,
    failedCalls: 0,
    pendingCalls: 0,
    activeAgents: 0,
    followUps: 0
  });

  const [recentCalls, setRecentCalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch dashboard data
    const fetchDashboardData = async () => {
      try {
        // Mock data - replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalCalls: 15420,
          successfulCalls: 12336,
          failedCalls: 2084,
          pendingCalls: 1000,
          activeAgents: 25,
          followUps: 156
        });

        setRecentCalls([
          {
            id: 1,
            customerName: 'John Doe',
            phoneNumber: '+91-9876543210',
            status: 'completed',
            duration: '2:45',
            timestamp: '2024-01-15 14:30:00',
            outcome: 'Payment promised'
          },
          {
            id: 2,
            customerName: 'Jane Smith',
            phoneNumber: '+91-9876543211',
            status: 'failed',
            duration: '0:15',
            timestamp: '2024-01-15 14:25:00',
            outcome: 'No answer'
          },
          {
            id: 3,
            customerName: 'Bob Johnson',
            phoneNumber: '+91-9876543212',
            status: 'completed',
            duration: '4:20',
            timestamp: '2024-01-15 14:20:00',
            outcome: 'Dispute raised'
          },
          {
            id: 4,
            customerName: 'Alice Brown',
            phoneNumber: '+91-9876543213',
            status: 'in-progress',
            duration: '1:30',
            timestamp: '2024-01-15 14:15:00',
            outcome: 'In conversation'
          }
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  const calculateSuccessRate = () => {
    const total = stats.totalCalls;
    if (total === 0) return 0;
    return ((stats.successfulCalls / total) * 100).toFixed(1);
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
    <div className="dashboard-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-tachometer-alt me-2"></i>
          Dashboard
        </h1>
        <div className="text-muted">
          <i className="fas fa-clock me-1"></i>
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card stats-card">
            <div className="card-body text-center">
              <i className="fas fa-phone fa-2x mb-2"></i>
              <h3>{stats.totalCalls.toLocaleString()}</h3>
              <p>Total Calls Today</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card stats-card">
            <div className="card-body text-center">
              <i className="fas fa-check-circle fa-2x mb-2"></i>
              <h3>{stats.successfulCalls.toLocaleString()}</h3>
              <p>Successful Calls</p>
              <small>Success Rate: {calculateSuccessRate()}%</small>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card stats-card">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x mb-2"></i>
              <h3>{stats.activeAgents}</h3>
              <p>Active AI Agents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <i className="fas fa-times-circle fa-2x mb-2 text-danger"></i>
              <h3>{stats.failedCalls.toLocaleString()}</h3>
              <p>Failed Calls</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <i className="fas fa-clock fa-2x mb-2 text-warning"></i>
              <h3>{stats.pendingCalls.toLocaleString()}</h3>
              <p>Pending Calls</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <i className="fas fa-flag fa-2x mb-2 text-info"></i>
              <h3>{stats.followUps}</h3>
              <p>Follow-ups Required</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Calls Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-history me-2"></i>
            Recent Calls
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Outcome</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map(call => (
                  <tr key={call.id}>
                    <td>
                      <strong>{call.customerName}</strong>
                    </td>
                    <td>{call.phoneNumber}</td>
                    <td>
                      <span className={getStatusBadge(call.status)}>
                        {call.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td>{call.duration}</td>
                    <td>{call.outcome}</td>
                    <td>
                      <small className="text-muted">
                        {new Date(call.timestamp).toLocaleTimeString()}
                      </small>
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

export default Dashboard;
