---
description: How to deploy the application to Vercel
---

# Deploying to Vercel

To create a shareable public link for your application, you can deploy it to Vercel.

## Prerequisites
- A Vercel account
- `npx` installed (comes with Node.js)

## Steps

1. **Run the deployment command:**
   ```bash
   npx vercel
   ```
   
2. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? **[Select your account]**
   - Link to existing project? **N**
   - Project name? **[Press Enter for default]**
   - In which directory? **[Press Enter for ./]**
   - Want to modify settings? **N**

3. **Wait for deployment:**
   - Vercel will build and deploy your app.
   - Once finished, it will provide a **Production** URL (e.g., `https://hyper-local-app.vercel.app`).

4. **Share the link:**
   - You can now share this URL with anyone to access the app on their phone or computer.

## Redeploying
To deploy updates, simply run:
```bash
npx vercel --prod
```
