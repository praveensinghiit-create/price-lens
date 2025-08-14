import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const HealthCheck = () => {
  const [healthy, setHealthy] = useState(null);

  useEffect(() => {
    apiService.healthCheck()
      .then(() => setHealthy(true))
      .catch(() => setHealthy(false));
  }, []);

  return (
    // <div className={`alert ${healthy ? 'alert-success' : 'alert-danger'}`}>
    //   {healthy ? '✔️ Server is Healthy' : '❌ Server not responding'}
    // </div>
    <div></div>
  );
};

export default HealthCheck;
