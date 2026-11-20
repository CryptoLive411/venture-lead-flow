# Venture Leads Capture

okay I want to create a better version of this to send to players and collect the leads in an organzied way iw ant ot use the venture colors and visiuals so can you make soemthing like this for me and I also want it to be linked to pipedrive so that when peopel fill it out it send directly to pipedrive for me and saves me time ill attach the venture media https://drive.google.com/drive/u/2/folders/1N45dYId1pWrkQgzcDdjKZBhHWVujEB56 all our media is int his google drive

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://venture-lead-flow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/43c2cb9a-8783-45af-8e54-07abc9ad872c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## How the player form works

1. **Account first.** At the top of the form the player creates their Ryval account (name, email, password, then the 6-digit code Ryval emails), or signs in to the one they have. The rest of the form opens after that. Coach and club accounts are turned away. It uses Ryval's public sign-up API, the same calls as app.ryvalsports.app (`src/lib/ryval.ts`); nothing here holds a Ryval secret.
2. **Submit.** The answers are saved to the player's Ryval profile (`PATCH /profile/me`: phone, club, position, nationality, GPA, graduation year, preferred levels, YouTube / Veo / Hudl link), the photo becomes their profile photo, and a highlight video goes straight to Ryval's storage. The lead goes to the rep's Pipedrive as before (`supabase/functions/submit-lead`), with a link to the player's Ryval profile in the deal note.
3. **After.** The success screen offers the Ryval app (App Store) and sign-in on the web; the player signs in with the same email and password.

Position is a list of the Ryval app's positions; Pipedrive gets the English name. New text lives in `src/translations/account.ts` for all ten languages; a missing string falls back to English.

`user_settings` is readable only by its owner (migration `20261120030000`): it holds each rep's Pipedrive token. Form links find a rep through `rep_id_for_username()`, which returns the id and nothing else.
