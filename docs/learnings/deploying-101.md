# Deploying 101

What W-5 taught: getting a Next.js app in a subdirectory onto Vercel, and why the repository
side was the easy half. Written for the next project's first deploy.

The round's headline: **the repository can only fix the problems the repository can express.**
Everything that actually blocked this deploy lived in a dashboard, and none of it was
discoverable by reading the code, the docs, or the build output.

---

## Three settings blocked the deploy, and the repo could express none of them

In the order they bit:

**The project was connected to the wrong repository.** It pointed at
`AngeloCP-01/acp-development-playbook`, a placeholder holding one unrelated commit, while the
work lived in `AngeloCP-01/development-playbook`. This is the worst of the three because it
does not look like a failure: the Deployments tab showed **three green production builds**. A
green build of the wrong repository is indistinguishable from success at a glance.

What gave it away was reading a commit SHA. The deployments were labelled `Initial commit` at
`79ef7a7`, and `git cat-file -t 79ef7a7` in the real repo answered `Not a valid object name`.

> **Check the SHA, not the status.** A deployment list tells you a build succeeded. It does not
> tell you what it built. One `git cat-file` settles it in a second.

**Framework Preset was `Other`.** The project had been created against the placeholder, which
had nothing to detect, so Vercel guessed. `Other`'s default output directory is `public` — and
this round had just deleted `public/` as dead scaffolding. The build failed with:

```
No Output Directory named "public" found after the Build completed.
```

That message names a symptom two steps from its cause. It reads like "you deleted something you
needed", and the honest answer is "your framework preset is wrong, and `public` was never the
output directory for this app." With the Next.js preset the output is `.next` and `public/` is
optional — the build works with no `public/` directory at all.

**Root Directory was unset.** The only one this round predicted, because the app lives in `web/`
and the repo root holds `docs/`. Its failure mode is at least legible: `No Next.js version
detected`.

## The repository cannot pin the host's runtime — check what your host actually reads

`reference/stack.md` says to match the Node version across local, CI and the host. This repo
had `.nvmrc`, and `.github/workflows/ci.yml` reads that same file, so two of three agreed.

**Vercel reads neither.** Its Node version comes from a project setting, overridden by
`engines.node` in `package.json`. The one environment that actually serves users was the one
nothing pinned — and Vercel now defaults new projects to a newer major than this repo targets,
so the mismatch would have happened by default rather than by accident.

Generalise it: for each environment that runs your code, find the file *that environment* reads.
Do not assume a version file is universal because it is popular.

## `prepare` scripts run on the host, and hosts have no `.git`

`package.json` had `"prepare": "lefthook install"`. pnpm runs `prepare` on every install,
`lefthook install` exits 1 outside a git repository, and Vercel's build environment excludes
`.git`. So `pnpm install` failed and the deploy died before any of the settings above mattered.

Neither `CI=1` nor `VERCEL=1` changes it — verified by running it, not by reading docs. The fix
is `"prepare": "lefthook install || true"`, which keeps hooks working everywhere that has a
`.git` and stops the install failing where there is none.

This is not specific to lefthook. Husky has the identical failure for the identical reason. **Any
`prepare` script that assumes a git repository will fail on a build host.**

Worth noting how it was found: not by planning, not by reading, but by a whole-branch review
that ran `lefthook install` in an empty directory and read the exit code. The round whose entire
purpose was enumerating deploy blockers enumerated one and shipped another.

## "No warning appeared" is not evidence

The round recorded, in three places, that `pnpm build` emitting **no `metadataBase` warning** was
proof the base URL had landed. It was not. Next emits that warning only from
`resolveAndValidateImage`, gated on a *relative image URL* needing resolution — and Open Graph
was a deliberate non-goal, so there were no images. A build with `metadataBase` deleted is
equally quiet.

**A check that cannot fail is not a check.** The test for whether a piece of evidence is real is
the teeth check: break the thing, and see whether the evidence changes. This one was cited in a
spec, repeated in a plan, and executed faithfully, and it never meant anything.

## The deployed URL is external knowledge, and no test can hold it

The origin was guessed from the project name: `acp-development-playbook.vercel.app`. The real
one is `acp-dev-playbook.vercel.app`. Vercel does not derive the hostname from the project name
the way the guess assumed.

The design survived it, and that is the transferable part. The origin lived in **one** constant
read from `NEXT_PUBLIC_SITE_URL` with a fallback, so production was corrected by setting an
environment variable — no code change, no redeploy of a fix, nothing wrong reaching a user. Had
the origin been written into `layout.tsx`, `sitemap.ts` and `robots.ts` separately, the same
correction would have been three edits and a release.

**Anything whose correct value only exists after deployment belongs behind one indirection, with
a fallback that is honestly labelled a guess until verified.**

## Verify against the running site, not the dashboard

A green deployment says a build finished. It does not say the site is right. The checks that
actually confirmed this deploy:

```
GET /robots.txt          → Allow: / and a Sitemap: line naming the real origin
GET /sitemap.xml         → 19 <loc> entries, all on the real origin
GET /stages/03-architecture → renders, title "03. Architecture · Development Playbook"
```

The `robots.txt` check is the highest-value one and it is nearly free: it prints the origin the
build actually used, so it tells you in one request whether your `SITE_URL` guess was right.

---

## The checklist, for next time

Before the first deploy:

- [ ] `prepare` script survives a checkout with no `.git`
- [ ] Node version pinned in the file *the host* reads — `engines.node`, not just `.nvmrc`
- [ ] The origin lives in one constant, env-overridable, fallback labelled as unverified

In the dashboard, before wondering why it failed:

- [ ] **Connected repository** — check the deployed commit SHA exists in your repo
- [ ] **Framework Preset** — set explicitly; a project created against an empty repo guesses
- [ ] **Root Directory** — set if the app is not at the repo root
- [ ] **Node version** — agrees with `engines.node`
- [ ] **Install command** — matches your package manager

After it goes green:

- [ ] Fetch `/robots.txt` and confirm the origin
- [ ] Fetch the sitemap and count the entries
- [ ] Load one real page and check the title
- [ ] Write the verified origin back into the fallback
