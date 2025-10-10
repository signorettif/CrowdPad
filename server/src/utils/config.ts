import { db } from '../db';

const configCache = new Map<string, any>();

export const getConfig = (key: string) => {
  if (configCache.has(key)) {
    return configCache.get(key);
  }

  const config = db
    .query('SELECT value FROM config WHERE key = ?')
    .get(key) as { value: any };
  if (config) {
    configCache.set(key, config.value);
    return config.value;
  }

  return null;
};

export const bustConfigCache = (key: string) => {
  configCache.delete(key);
};
