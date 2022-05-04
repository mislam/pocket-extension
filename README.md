# Pocket

A supercharged crypto wallet browser extension to manage POKT tokens.

## Stack

-  Vite
-  Vue 3
-  Tailwind CSS
-  PocketJS

## Install

Run:

```
npm install
```

## Configure

### .env

Make 3 copies `.env.example` for `local`, `staging` and `production` environments:

```
cp src/.env.example src/.env
cp src/.env.example src/.env.staging
cp src/.env.example src/.env.production
```

### Portal ID

We need to create two applications under Pocket Portal. Let's name them:

-  Pocket Wallet (STAG) for local and staging environments, and
-  Pocket Wallet (PROD) for production environment

Copy the Portal ID from `STAG` app and use it in `.env` and `.env.staging`. And copy the Portal ID from `PROD` app and use it in `.env.production`.

Uncomment the following line only for `.env.staging`.

```
NODE_ENV=production
```

### Extansion ID

We need to lock the extension ID to prevent software piracy. If anyone copies the code and tries to clone the extension, the code should not work. In order to achieve that, we need to:

-  First get the extension ID from Chrome Web Store Developer Dashboard
-  Use the encrypt method from `modules/encryptor` and encrypt the ID using `sha256` of the `ENCRYPTION_KEY`
-  Paste the encrypted extension ID in `.env.production`

Example code:

```javascript
;(async () => {
   const extensionId = 'paste-chrome-extension-id-here'
   const encryptedExtensionId = await encrypt(await sha256(Config.ENCRYPTION_KEY), extensionId)
   console.log(encryptedExtensionId)
})()
```

## Develop

Run local dev server:

```
npm run dev
```

And open http://localhost:3000/popup.html

## Build

For each new build, make sure to bump the version number in `public/manifest.json`.

### Build Staging

Before we deploy for production, first we need to build for staging in order to test the extension locally. Run:

```
npm run build:staging
```

This will generate the build package under `build/staging` directory.

Then:

Step 1 - Open up Chrome or Brave browser.  
Step 2 - Go to: `chrome://extensions`.  
Step 3 - Turn on developer mode.  
Step 4 - Click `Load unpacked` and select the current staging version from `build/staging` directory.

### Build Production

Run:

```
npm run build:production
```

This will generate the build package under `build/production` directory.
