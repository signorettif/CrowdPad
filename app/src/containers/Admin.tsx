import { useEffect, useState } from 'react';

import { UpdateConfigForm } from '../components/admin/UpdateConfig';

import { getConfig } from '../api/config';

import type { Config } from '../types';

export const Admin = () => {
  const [initialConfig, setInitialConfig] = useState<Config | undefined>(
    undefined
  );
  const [error, setError] = useState<Error | undefined>(undefined);
  const loadingInitialConfig = !initialConfig && !error;

  useEffect(() => {
    getConfig()
      .then((configResponse) => {
        setInitialConfig(configResponse);
      })
      .catch((err) => setError(err));
  }, []);

  return (
    <main className="container mx-auto flex flex-col gap-6 p-6 lg:flex-row">
      <div className="flex-1 rounded-lg bg-white p-6 shadow-lg">
        {loadingInitialConfig ? (
          'Loading...'
        ) : error ? (
          `There was an error: ${error.message}`
        ) : initialConfig ? (
          <UpdateConfigForm initialConfig={initialConfig} />
        ) : (
          'No configuration found.'
        )}
      </div>
    </main>
  );
};
