import React, { useState, useEffect } from 'react';

function Analytics() {
  const [analytics, setAnalytics] = useState({
    callMetrics: {
      totalCalls: 0,
      successRate: 0,
      averageDuration: 0,
      conversionRate: 0
    },
    timeMetrics: {
      peakHours: [],
      dailyTrends: []
    },
    outcomeMetrics: {
      paymentPromised: 0,
      disputeRaised: 0,
      noAnswer: 0,
      callback: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setAnalytics({
          callMetrics: {
            totalCalls: 15420,
            successRate: 78.5,
            averageDuration: 185, // seconds
            conversionRate: 23.4
          },
          timeMetrics: {
            peakHours: [
              { hour: '10:00', calls: 1250 },
              { hour: '11:00', calls: 1420 },
              { hour: '14:00', calls: 1380 },
              { hour: '15:00', calls: 1520 },
              { hour: '16:00', calls: 1180 }
            ],
            dailyTrends: [
              { day: 'Mon', calls: 2100, success: 1680 },
              { day: 'Tue', calls: 2300, success: 1840 },
              { day: 'Wed', calls: 2150, success: 1720 },
              { day: 'Thu', calls: 2400, success: 1920 },
              { day: 'Fri', calls: 2200, success: 1760 },
              { day: 'Sat', calls: 1800, success: 1440 },
              { day: 'Sun', calls: 1470, success: 1176 }
            ]
          },
          outcomeMetrics: {
            paymentPromised: 3608, // 23.4%
            disputeRaised: 1542,   // 10%
            noAnswer: 4626,        // 30%
            callback: 2314,        // 15%
            other: 3330           // 21.6%
          }
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateRange]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPercentage = (value, total) => {
    return ((value / total) * 100).toFixed(1);
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
          <i className="fas fa-chart-bar me-2"></i>
          Analytics
        </h1>
        <select
          className="form-select"
          style={{ width: 'auto' }}
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card metric-card">
            <div className="card-body">
              <div className="metric-value">{analytics.callMetrics.totalCalls.toLocaleString()}</div>
              <div className="metric-label">Total Calls</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card metric-card">
            <div className="card-body">
              <div className="metric-value">{analytics.callMetrics.successRate}%</div>
              <div className="metric-label">Success Rate</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card metric-card">
            <div className="card-body">
              <div className="metric-value">{formatDuration(analytics.callMetrics.averageDuration)}</div>
              <div className="metric-label">Avg Duration</div>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card metric-card">
            <div className="card-body">
              <div className="metric-value">{analytics.callMetrics.conversionRate}%</div>
              <div className="metric-label">Conversion Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        {/* Call Outcomes */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-pie-chart me-2"></i>
                Call Outcomes
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle me-2" style={{width: '12px', height: '12px'}}></div>
                    <span className="small">Payment Promised</span>
                  </div>
                  <div className="fw-bold">{analytics.outcomeMetrics.paymentPromised.toLocaleString()} ({formatPercentage(analytics.outcomeMetrics.paymentPromised, analytics.callMetrics.totalCalls)}%)</div>
                </div>
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning rounded-circle me-2" style={{width: '12px', height: '12px'}}></div>
                    <span className="small">Dispute Raised</span>
                  </div>
                  <div className="fw-bold">{analytics.outcomeMetrics.disputeRaised.toLocaleString()} ({formatPercentage(analytics.outcomeMetrics.disputeRaised, analytics.callMetrics.totalCalls)}%)</div>
                </div>
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-danger rounded-circle me-2" style={{width: '12px', height: '12px'}}></div>
                    <span className="small">No Answer</span>
                  </div>
                  <div className="fw-bold">{analytics.outcomeMetrics.noAnswer.toLocaleString()} ({formatPercentage(analytics.outcomeMetrics.noAnswer, analytics.callMetrics.totalCalls)}%)</div>
                </div>
                <div className="col-6 mb-3">
                  <div className="d-flex align-items-center">
                    <div className="bg-info rounded-circle me-2" style={{width: '12px', height: '12px'}}></div>
                    <span className="small">Callback Requested</span>
                  </div>
                  <div className="fw-bold">{analytics.outcomeMetrics.callback.toLocaleString()} ({formatPercentage(analytics.outcomeMetrics.callback, analytics.callMetrics.totalCalls)}%)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="col-md-6 mb-3">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Peak Call Hours
              </h5>
            </div>
            <div className="card-body">
              {analytics.timeMetrics.peakHours.map((hour, index) => (
                <div key={index} className="mb-2">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{hour.hour}</span>
                    <span>{hour.calls} calls</span>
                  </div>
                  <div className="progress" style={{height: '8px'}}>
                    <div 
                      className="progress-bar bg-primary" 
                      style={{width: `${(hour.calls / 1520) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Trends */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-chart-line me-2"></i>
            Daily Call Trends
          </h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Total Calls</th>
                  <th>Successful Calls</th>
                  <th>Success Rate</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {analytics.timeMetrics.dailyTrends.map((day, index) => (
                  <tr key={index}>
                    <td><strong>{day.day}</strong></td>
                    <td>{day.calls.toLocaleString()}</td>
                    <td>{day.success.toLocaleString()}</td>
                    <td>{formatPercentage(day.success, day.calls)}%</td>
                    <td>
                      <div className="progress" style={{height: '20px', width: '100px'}}>
                        <div 
                          className="progress-bar bg-success" 
                          style={{width: `${(day.success / day.calls) * 100}%`}}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-download me-2"></i>
            Export Reports
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <button className="btn btn-outline-primary w-100 mb-2">
                <i className="fas fa-file-csv me-2"></i>
                Export to CSV
              </button>
            </div>
            <div className="col-md-4">
              <button className="btn btn-outline-success w-100 mb-2">
                <i className="fas fa-file-excel me-2"></i>
                Export to Excel
              </button>
            </div>
            <div className="col-md-4">
              <button className="btn btn-outline-danger w-100 mb-2">
                <i className="fas fa-file-pdf me-2"></i>
                Export to PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
