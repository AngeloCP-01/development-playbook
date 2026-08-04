/**
 * The site's public origin, in one place because three files need it:
 * `layout.tsx`'s `metadataBase`, `sitemap.ts`, and `robots.ts`. A deploy round
 * that writes the same origin into three files has built the drift it exists
 * to prevent.
 *
 * `NEXT_PUBLIC_` is not decoration. The site is fully static, so the value is
 * inlined at build time — an unprefixed variable would be `undefined` in the
 * shipped bundle and every canonical URL would silently fall back.
 *
 * The fallback is the Vercel-assigned origin for the `acp-development-playbook`
 * project. A custom domain is a one-line change here, or an env var in the
 * Vercel dashboard with no code change at all.
 *
 * No trailing slash: callers concatenate paths onto it.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  'https://acp-development-playbook.vercel.app'
