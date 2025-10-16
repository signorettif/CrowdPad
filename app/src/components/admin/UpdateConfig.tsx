import { useState, type FormEventHandler } from 'react';

import { updateConfig } from '../../api/config';
import { cn } from '../../utils/cn';

import type { Config, UpdateConfigStatus } from '../../types';

const UPDATE_CONFIG_STATUS_MESSAGES: Record<UpdateConfigStatus, string> = {
  not_started: '',
  updating: 'Updating config...',
  updated: 'Config updated successfully!',
  update_error: 'Error updating config.',
};

interface UpdateConfigFormProps {
  initialConfig: Config;
}

export const UpdateConfigForm = ({ initialConfig }: UpdateConfigFormProps) => {
  const [updateConfigStatus, setUpdateConfigStatus] =
    useState<UpdateConfigStatus>('not_started');
  const updateConfigStatusMessage =
    UPDATE_CONFIG_STATUS_MESSAGES[updateConfigStatus];
  const isUpdateConfigDisabled = updateConfigStatus === 'updating';

  const handleUpdateConfig: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    setUpdateConfigStatus('updating');

    const formData = new FormData(evt.currentTarget);
    const newConfig: Partial<Config> = {};
    const adminKey = String(formData.get('adminKey') || '');

    for (const key in initialConfig) {
      if (Object.prototype.hasOwnProperty.call(initialConfig, key)) {
        const formValue = formData.get(key);
        if (typeof formValue === 'number') {
          newConfig[key as keyof Config] = formValue;
        }
      }
    }

    try {
      await updateConfig(newConfig as Config, adminKey);
      setUpdateConfigStatus('updated');
    } catch {
      setUpdateConfigStatus('update_error');
    }
  };

  return (
    <form
      className="mb-6"
      onSubmit={handleUpdateConfig}
      aria-disabled={isUpdateConfigDisabled}
    >
      <div className="mb-4" key="adminKey">
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Admin Key
        </label>
        <input
          type="password"
          name="adminKey"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Enter admin key"
          disabled={isUpdateConfigDisabled}
          aria-disabled={isUpdateConfigDisabled}
        />
      </div>

      {Object.entries(initialConfig).map(([configKey, configValue]) => {
        return (
          <div className="mb-4" key={configKey}>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              {configKey}
            </label>
            <input
              type={typeof configValue === 'number' ? 'number' : 'text'}
              name={configKey}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={configKey}
              defaultValue={String(configValue)}
              disabled={isUpdateConfigDisabled}
              aria-disabled={isUpdateConfigDisabled}
            />
          </div>
        );
      })}

      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        disabled={isUpdateConfigDisabled}
        aria-disabled={isUpdateConfigDisabled}
      >
        Update Config
      </button>

      {updateConfigStatusMessage && (
        <div
          className={cn('mt-2 text-center text-sm', {
            'text-green-600': updateConfigStatus === 'updated',
            'text-red-600': updateConfigStatus === 'update_error',
            'text-gray-600': updateConfigStatus === 'updating',
          })}
        >
          {updateConfigStatusMessage}
        </div>
      )}
    </form>
  );
};
