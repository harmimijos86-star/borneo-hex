# BORNEO HEX Website v0.1

Official BORNEO HEX landing page prototype.

## Stack
- Vanilla HTML / CSS / JavaScript
- Firebase Hosting
- Cloud Firestore for RFQ leads
- GitHub for source control

## Local preview
Run any static web server from the project root, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Firebase setup
1. Create one Firebase project for BORNEO HEX.
2. Add a Web App and copy its Firebase config.
3. Replace placeholders in `js/firebase-config.js`.
4. Set `demoMode: false`.
5. Add the BORNEO HEX WhatsApp number in international format without `+` or spaces.
6. Create a Cloud Firestore database (Standard edition).
7. Deploy the included Firestore rules.
8. Enable Firebase Hosting.

Typical CLI flow:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
firebase deploy --only hosting
```

## Security note
The website only permits unauthenticated `create` operations to the `leads` collection, with field validation. Public reads/updates/deletes are denied. For a higher-volume launch, add Firebase App Check / anti-spam controls before paid traffic.

## Current v0.1 features
- Responsive BORNEO HEX master-brand landing page
- Service selector
- BH-01 / BH-02 / BH-03 package cards
- Interactive Site Package Builder
- Event, industrial sourcing, fabrication and packaging sections
- RFQ form
- Demo-mode localStorage fallback before Firebase configuration
- WhatsApp handoff once business number is configured
