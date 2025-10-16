import type { Config } from '../types';

type GetConfigResponse = Config;

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const getConfig = async (): Promise<GetConfigResponse> => {
  const res = await fetch(`${API_BASE_URL}/config`);
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch config: ${res.status} ${errorText}`);
  }
  return res.json();
};

type UpdateConfigResponse = Config;

export const updateConfig = async (
  newConfig: Config,
  adminToken: string
): Promise<UpdateConfigResponse> => {
  const res = await fetch(`${API_BASE_URL}/config`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newConfig),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to update config: ${res.status} ${errorText}`);
  }
  return res.json();
};
