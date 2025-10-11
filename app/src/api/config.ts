import type { Config } from '../types';

type GetConfigResponse = Config;

export const getConfig = () => {
  return fetch<GetConfigResponse>('');
};

type UpdateConfigResponse = Config;

export const updateConfig = (newConfig: Config) => {
  return fetch<UpdateConfigResponse>('');
};
