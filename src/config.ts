// src/config.ts

/**
 * Configuration options for the UjumbeSMS client
 */
export interface UjumbeSmsConfig {
  /**
   * Your UjumbeSMS API key
   */
  apiKey: string;

  /**
   * Email address associated with your UjumbeSMS account
   */
  email: string;

  /**
   * Base URL for the UjumbeSMS API (defaults to https://ujumbesms.co.ke)
   */
  baseUrl?: string;

  /**
   * Request timeout in milliseconds (defaults to 30000)
   */
  timeout?: number;
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<UjumbeSmsConfig> = {
  baseUrl: "https://ujumbesms.co.ke",
  timeout: 30000,
};

/**
 * Creates a complete configuration object by merging provided options with defaults
 *
 * @param config - User-provided configuration options
 * @returns Complete configuration with defaults applied
 */
export function createConfig(
  config: UjumbeSmsConfig,
): Required<UjumbeSmsConfig> {
  return {
    ...DEFAULT_CONFIG,
    ...config,
    baseUrl: config.baseUrl || DEFAULT_CONFIG.baseUrl!,
    timeout: config.timeout || DEFAULT_CONFIG.timeout!,
  } as Required<UjumbeSmsConfig>;
}
