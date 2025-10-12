import { useState, type FormEventHandler } from 'react';

import { updateConfig } from '../../api/config';
import { cn } from '../../utils/cn';

import type { Config, UpdateConfigStatus } from '../../types';

const UPDATE_CONFIG_STATUS_MESSAGES: Record<UpdateConfigStatus, string> = {
  not_started: '',
  updating: '',
  updated: 'Config updated successfully!',
  update_error: 'Error updating config.',
};

interface UpdateConfigFormProps {
  initialConfig: Config;
}

export const UpdateConfigForm = ({ initialConfig }: UpdateConfigFormProps) => {
  const [updateConfigStatus, setUpdateConfigStatus] =
    useState<UpdateConfigStatus>('not_started');
  const updateConfigStatusMessage = UPDATE_CONFIG_STATUS_MESSAGES[authStatus];
  const isUpdateConfigDisabled = updateConfigStatusMessage === 'updating';

  const handleUpdateConfig: FormEventHandler<HTMLFormElement> = async (evt) => {
    evt.preventDefault();
    setUpdateConfigStatus('updating');

    const formData = new FormData(evt.currentTarget);
    const secretKey = formData.get('secretKey') as string;
    const username = formData.get('username') as string;
    if (!secretKey?.trim()) {
      alert('Please enter a secret key');
      return;
    }
    if (!username?.trim()) {
      alert('Please enter a secret key');
      return;
    }

    try {
      await updateConfig(config);
      setUpdateConfigStatus('updated');
    } catch (err) {
      setUpdateConfigStatus('update_error');
    }
  };

  return (
    <form
      className="mb-6"
      onSubmit={handleUpdateConfig}
      aria-disabled={isUpdateConfigDisabled}
    >
      {Object.values(initialConfig).map(([configKey, configValue]) => {
        return (
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">
              {configKey}
            </label>
            <input
              type="text"
              name={configKey}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={configKey}
              defaultValue={configValue}
              disabled={isUpdate}
              aria-disabled={isUpdate}
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
        Authenticate
      </button>

      {updateConfigStatusMessage && (
        <div
          className={cn('mt-2 text-center text-sm', {
            'text-green-600': updateConfigStatus === 'updated',
            'text-red-600': updateConfigStatus === 'update_error',
          })}
        >
          {updateConfigStatusMessage}
        </div>
      )}
    </form>
  );
};
