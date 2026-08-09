import { publicEnv } from "@/config/public-env";

/** GTM / analytics only run in production unless explicit debug is on. */
export function isClientAnalyticsEnabled(): boolean {
  if (publicEnv.analyticsDebug) {
    return Boolean(publicEnv.gtmId || publicEnv.gaMeasurementId);
  }
  return publicEnv.isProduction && Boolean(publicEnv.gtmId || publicEnv.gaMeasurementId);
}

export function isSentryEnabled(): boolean {
  return Boolean(publicEnv.sentryDsn);
}

export function getGtmId(): string {
  return publicEnv.gtmId;
}

export function getGaMeasurementId(): string {
  return publicEnv.gaMeasurementId;
}
