// allows sending up to 10 commands a second per each user
import { getConfig } from './utils/config';

// allows sending up to 10 commands a second per each user
export const getInputCommanddown = () =>
  (getConfig('cooldown') as number) || 100;
