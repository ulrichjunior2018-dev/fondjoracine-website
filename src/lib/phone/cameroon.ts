/**
 * Cameroon mobile numbers: 9 local digits starting with 6, where the second
 * digit is 5-9 in every range currently assigned to MTN, Orange, and
 * Nexttel (65x/66x/67x/68x/69x). This is a format check, not a live
 * carrier-range lookup — it won't catch every typo (a wrong-but-plausible
 * number still passes), but it rejects the common mistakes a bare
 * `/^6\d{8}$/` let through: too few/many digits, or a 60-64 prefix that no
 * carrier has issued. Used by both checkout validation (domain/commerce)
 * and the SMS channel's E.164 resolution so the two can't drift apart.
 */
export const CAMEROON_MOBILE_LOCAL_PATTERN = /^6[5-9]\d{7}$/;
