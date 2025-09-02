import React, { useState } from 'react';

function Settings() {
  const [settings, setSettings] = useState({
    calling: {
      maxConcurrentCalls: 50,
      callTimeout: 30,
      retryAttempts: 3,
      retryInterval: 60
    },
    compliance: {
      recordCalls: true,
      playLegalScript: true,
      requireConsent: true,
      maxCallDuration: 300
    },
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      slackIntegration: true,
      alertThreshold: 10
    },
    ai: {
      voiceModel: 'neural',
      language: 'en-IN',
      responseTimeout: 5,
      confidenceThreshold: 0.8
    }
  });

  const [activeTab, setActiveTab] = useState('calling');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const renderCallingSettings = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-phone me-2"></i>
          Calling Configuration
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Max Concurrent Calls</label>
            <input
              type="number"
              className="form-control"
              value={settings.calling.maxConcurrentCalls}
              onChange={(e) => handleSettingChange('calling', 'maxConcurrentCalls', parseInt(e.target.value))}
              min="1"
              max="100"
            />
            <small className="text-muted">Maximum number of simultaneous calls</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Call Timeout (seconds)</label>
            <input
              type="number"
              className="form-control"
              value={settings.calling.callTimeout}
              onChange={(e) => handleSettingChange('calling', 'callTimeout', parseInt(e.target.value))}
              min="10"
              max="120"
            />
            <small className="text-muted">Time to wait before hanging up</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Retry Attempts</label>
            <input
              type="number"
              className="form-control"
              value={settings.calling.retryAttempts}
              onChange={(e) => handleSettingChange('calling', 'retryAttempts', parseInt(e.target.value))}
              min="0"
              max="10"
            />
            <small className="text-muted">Number of retry attempts for failed calls</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Retry Interval (minutes)</label>
            <input
              type="number"
              className="form-control"
              value={settings.calling.retryInterval}
              onChange={(e) => handleSettingChange('calling', 'retryInterval', parseInt(e.target.value))}
              min="5"
              max="1440"
            />
            <small className="text-muted">Time between retry attempts</small>
          </div>
        </div>
      </div>
    </div>
  );

  const renderComplianceSettings = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-shield-alt me-2"></i>
          Compliance & Legal
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={settings.compliance.recordCalls}
                onChange={(e) => handleSettingChange('compliance', 'recordCalls', e.target.checked)}
              />
              <label className="form-check-label">
                Record All Calls
              </label>
            </div>
            <small className="text-muted">Enable call recording for compliance</small>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={settings.compliance.playLegalScript}
                onChange={(e) => handleSettingChange('compliance', 'playLegalScript', e.target.checked)}
              />
              <label className="form-check-label">
                Play Legal Script
              </label>
            </div>
            <small className="text-muted">Play mandatory legal disclaimer</small>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={settings.compliance.requireConsent}
                onChange={(e) => handleSettingChange('compliance', 'requireConsent', e.target.checked)}
              />
              <label className="form-check-label">
                Require Consent
              </label>
            </div>
            <small className="text-muted">Require explicit consent before proceeding</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Max Call Duration (seconds)</label>
            <input
              type="number"
              className="form-control"
              value={settings.compliance.maxCallDuration}
              onChange={(e) => handleSettingChange('compliance', 'maxCallDuration', parseInt(e.target.value))}
              min="60"
              max="1800"
            />
            <small className="text-muted">Maximum allowed call duration</small>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-bell me-2"></i>
          Notifications & Alerts
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={settings.notifications.emailAlerts}
                onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
              />
              <label className="form-check-label">
                Email Alerts
              </label>
            </div>
            <small className="text-muted">Send alerts via email</small>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={settings.notifications.smsAlerts}
                onChange={(e) => handleSettingChange('notifications', 'smsAlerts', e.target.checked)}
              />
              <label className="form-check-label">
                SMS Alerts
              </label>
            </div>
            <small className="text-muted">Send alerts via SMS</small>
          </div>
          <div className="col-md-6 mb-3">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={settings.notifications.slackIntegration}
                onChange={(e) => handleSettingChange('notifications', 'slackIntegration', e.target.checked)}
              />
              <label className="form-check-label">
                Slack Integration
              </label>
            </div>
            <small className="text-muted">Send notifications to Slack</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Alert Threshold (%)</label>
            <input
              type="number"
              className="form-control"
              value={settings.notifications.alertThreshold}
              onChange={(e) => handleSettingChange('notifications', 'alertThreshold', parseInt(e.target.value))}
              min="1"
              max="100"
            />
            <small className="text-muted">Failure rate threshold for alerts</small>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">
          <i className="fas fa-robot me-2"></i>
          AI Configuration
        </h5>
      </div>
      <div className="card-body">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Voice Model</label>
            <select
              className="form-select"
              value={settings.ai.voiceModel}
              onChange={(e) => handleSettingChange('ai', 'voiceModel', e.target.value)}
            >
              <option value="standard">Standard</option>
              <option value="neural">Neural (Recommended)</option>
              <option value="premium">Premium</option>
            </select>
            <small className="text-muted">Voice synthesis quality</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Language</label>
            <select
              className="form-select"
              value={settings.ai.language}
              onChange={(e) => handleSettingChange('ai', 'language', e.target.value)}
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (India)</option>
              <option value="en-US">English (US)</option>
            </select>
            <small className="text-muted">Primary language for conversations</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Response Timeout (seconds)</label>
            <input
              type="number"
              className="form-control"
              value={settings.ai.responseTimeout}
              onChange={(e) => handleSettingChange('ai', 'responseTimeout', parseInt(e.target.value))}
              min="1"
              max="30"
            />
            <small className="text-muted">Time to wait for customer response</small>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Confidence Threshold</label>
            <input
              type="number"
              className="form-control"
              value={settings.ai.confidenceThreshold}
              onChange={(e) => handleSettingChange('ai', 'confidenceThreshold', parseFloat(e.target.value))}
              min="0.1"
              max="1.0"
              step="0.1"
            />
            <small className="text-muted">Minimum confidence for AI responses</small>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-cog me-2"></i>
          Settings
        </h1>
        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="fas fa-save me-2"></i>
              Save Settings
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} mb-4`}>
          <i className={`fas ${message.includes('Error') ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`}></i>
          {message}
        </div>
      )}

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'calling' ? 'active' : ''}`}
            onClick={() => setActiveTab('calling')}
          >
            <i className="fas fa-phone me-2"></i>
            Calling
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'compliance' ? 'active' : ''}`}
            onClick={() => setActiveTab('compliance')}
          >
            <i className="fas fa-shield-alt me-2"></i>
            Compliance
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <i className="fas fa-bell me-2"></i>
            Notifications
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <i className="fas fa-robot me-2"></i>
            AI Settings
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'calling' && renderCallingSettings()}
        {activeTab === 'compliance' && renderComplianceSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'ai' && renderAISettings()}
      </div>
    </div>
  );
}

export default Settings;
