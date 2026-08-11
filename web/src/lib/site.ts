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
 * The fallback was originally guessed from the Vercel project name, and the
 * guess was wrong — the assigned origin is `acp-dev-playbook`, not
 * `acp-development-playbook`. It is now the verified production origin, read
 * off the live deployment rather than derived. Production overrides it with
 * NEXT_PUBLIC_SITE_URL anyway, which is why the wrong value never reached
 * users; what it did reach was every local and CI build, where canonical URLs
 * pointed at a host that did not exist.
 *
 * No test can catch a wrong value here — the correct one is external
 * knowledge. Check it against the live site rather than against the code.
 *
 * No trailing slash: callers concatenate paths onto it.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://acp-dev-playbook.vercel.app'
