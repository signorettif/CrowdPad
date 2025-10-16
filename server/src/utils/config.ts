import { db } from '../db';

export type ConfigKey = 'aggregationInterval' | 'cooldown';

class Config {
  private aggregationInterval: number = 1000;
  private cooldown: number = 100;

  constructor() {
    this.load();
  }

  private load() {
    const dbConfig = db.query('SELECT key, value FROM config').all() as {
      key: string;
      value: any;
    }[];

    for (const row of dbConfig) {
      switch (row.key) {
        case 'aggregation_interval':
          this.aggregationInterval = !isNaN(Number(row.value))
            ? Number(row.value)
            : this.aggregationInterval;
          break;
        case 'cooldown':
          this.cooldown = !isNaN(Number(row.value))
            ? Number(row.value)
            : this.cooldown;
          break;
        default:
          continue;
      }
    }
  }

  get(key: ConfigKey) {
    return this[key];
  }

  getAll() {
    return {
      aggregationInterval: this.aggregationInterval,
      cooldown: this.cooldown,
    };
  }

  getAllKeys() {
    return Object.keys(this.getAll());
  }

  hasKey(candidateKey: string): candidateKey is ConfigKey {
    return this.getAllKeys().includes(candidateKey);
  }

  update(key: ConfigKey, value: any) {
    this[key] = value;
    db.run(
      'INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)',
      this.getDbKey(key),
      value
    );
  }

  isValueValidForKey(key: ConfigKey, value: string) {
    switch (key) {
      case 'aggregationInterval':
      case 'cooldown':
        return typeof value === 'number' && value > 0;
      default:
        return true;
    }
  }

  private getDbKey(key: ConfigKey): string {
    switch (key) {
      case 'aggregationInterval':
        return 'aggregation_interval';
      default:
        return key;
    }
  }
}

export const config = new Config();
