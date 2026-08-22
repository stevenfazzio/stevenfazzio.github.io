// Site-wide constants. Update here, not in templates.

export const SITE_TITLE = 'Steven Fazzio';
export const SITE_URL = 'https://stevenfazzio.com';
export const SITE_DESCRIPTION = 'I make maps of large text collections.';

// The one-liner tracks current focus, not a permanent charter (see SPEC.md).
export const ONE_LINER = 'I make maps of large text collections.';
export const ONE_LINER_GLOSS =
  'I embed a corpus, lay it out in two dimensions, and name the regions.';

export const AUTHOR = 'Steven Fazzio';
export const CONTACT_EMAIL = 'steven@stevenfazzio.com';
export const GITHUB_URL = 'https://github.com/stevenfazzio';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/stevenfazzio/';

// Every profile that should appear in JSON-LD `sameAs` and as a `rel="me"`
// link. One list, so adding a profile updates the identity graph everywhere.
export const PROFILES = [GITHUB_URL, LINKEDIN_URL];

// Fallback social card. Pages without their own image get this one; posts
// override it with their hero. Per SPEC.md: "the card image is what gets
// clicked," so no page should ship a bare text card.
export const OG_IMAGE_DEFAULT = '/images/og-default.png';

// Buttondown username for the email-signup form. Leave empty to render the
// RSS-only subscribe line; set it once the Buttondown account exists (must
// happen before the first promoted post, per SPEC.md).
export const BUTTONDOWN_USERNAME = '';
