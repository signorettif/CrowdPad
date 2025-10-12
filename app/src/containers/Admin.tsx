import { useEffect, useState } from 'react';

import { UpdateConfigForm } from '../components/admin/UpdateConfig';

import { getAllConfig } from '../api/config';

import type { Config } from '../types';

export const Admin = () => {
  const [initialConfig, setInitialConfig] = useState<Config | undefined>(
    undefined
  );
  const [error, setError] = useState(undefined);
  const loadingInitialConfig = !initialConfig && !error;

  useEffect(() => {
    getAllConfig()
      .then((configResponse) => {
        setInitialConfig(configResponse);
      })
      .catch((err) => setError(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 rounded-lg bg-white p-6 shadow-lg">
            {loadingInitialConfig ? (
              'Loading...'
            ) : error ? (
              `There was an error ${error}`
            ) : (
              <UpdateConfigForm initialConfig={initialConfig} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
