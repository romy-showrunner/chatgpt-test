# SHOWRUNNER — Cinematic v4 staging

This repository is the staging home for the SHOWRUNNER Magazine rebuild.

## Design baseline
- Cinematic v4 magazine with full-screen photographic heroes
- Moleskine-style reading pages, not pop-up articles
- Sports green; Tech blue; fine-line precision design and corner markers
- LIVE event desks for SailGP and Web Summit; calendar-led event lifecycle
- People cards with masked initials and verified organisational relationships

## Architecture target
- Netlify: public staging preview
- Sanity: structured articles, people, organisations, events, and LIVE updates
- GitHub: presentation templates and application code

## Safety
The existing Wix site and the earlier Claude/Netlify prototype remain untouched. Never commit Sanity tokens, Netlify tokens, or unpublished source material to a public repository.

## Deployment
The static Cinematic v4 package is ready to be imported. For a zero-build static Netlify site, the publish directory will be the repository root and the build command will be blank. The Sanity API integration will be added after staging is working.
