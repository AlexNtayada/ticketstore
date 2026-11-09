import type { FeatureFlags } from "@/types/event";

/**
 * Freemium tiers. One codebase, one template: premium capabilities are
 * switched on by configuration. Some flags need a supporting service
 * (custom domain DNS, newsletter provider, analytics consent) — the flag only
 * enables the front-end part; see README › "External integrations".
 */
export const FREE_FEATURES: FeatureFlags = {
  videoHero: false,
  advancedMotion: false,
  customFonts: false,
  customColors: false,
  customDomain: false,
  advancedGallery: false,
  mediaEmbeds: false,
  advancedLineup: false,
  newsletter: false,
  analytics: false,
  countdown: false,
  multipleEvents: false,
  removeTicketstoreBranding: false,
};

export const PREMIUM_FEATURES: FeatureFlags = {
  videoHero: true,
  advancedMotion: true,
  customFonts: true,
  customColors: true,
  customDomain: true,
  advancedGallery: true,
  mediaEmbeds: true,
  advancedLineup: true,
  newsletter: true,
  analytics: true,
  countdown: true,
  multipleEvents: true,
  removeTicketstoreBranding: true,
};

export const PREMIUM_FEATURE_KEYS = Object.keys(PREMIUM_FEATURES) as (keyof FeatureFlags)[];
