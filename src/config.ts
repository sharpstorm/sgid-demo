import dotenv from 'dotenv';
import { ServerConfig } from './types';
import { nanoid } from 'nanoid/non-secure';

function tryParseInt(defaultValue: number, data?: string): number {
  if (!data) {
    return defaultValue;
  }

  try {
    return parseInt(data);
  } catch (err) {}

  return defaultValue;
}

function requireValue<T>(value: T | undefined, errorMsg: string): T {
  if (!value) {
    throw new Error(errorMsg);
  }
  return value;
}

export function loadConfig(): ServerConfig {
  dotenv.config();

  return {
    port: tryParseInt(3000, process.env.PORT),
    sgidClientId: requireValue(
      process.env.SGID_CLIENT_ID,
      'SGID_CLIENT_ID must be set in environment variables'
    ),
    sgidClientSecret: requireValue(
      process.env.SGID_CLIENT_SECRET,
      'SGID_CLIENT_SECRET must be set in environment variables'
    ),
    sgidPrivateKey: requireValue(
      process.env.SGID_PRIVATE_KEY,
      'SGID_PRIVATE_KEY must be set in environment variables'
    ),
    host: requireValue(
      process.env.HOST,
      'HOST must be set in environment variables'
    ),
    cookieSecret: nanoid(),
  };
}
