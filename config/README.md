# Local Credentials Template (Development Only)

This folder contains a **sample JSON** you can use to mirror what you store in **AWS Secrets Manager**.
It is intended for **development/testing only**, so you can run the app without cloud credentials.

## Files
- `config/put_credentials_here.json` (project root): canonical template
- `src/config/put_credentials_here.json` (importable by the frontend build)

## How to Enable Local Fallback
1. Set an environment flag before building/serving your app:
   - **Vite**: `VITE_USE_LOCAL_CREDS=true`
   - **Next.js**: `NEXT_PUBLIC_USE_LOCAL_CREDS=true`
   - **Create React App**: `REACT_APP_USE_LOCAL_CREDS=true`

2. The app will first try AWS Secrets Manager (if configured). If that fails **or** the env flag above is set,
   it will fallback to loading `src/config/put_credentials_here.json` and treat it as a single company config.

## Shape
The JSON matches what you'd store per-company in Secrets Manager. Placeholders are provided for:
- Microsoft 365 (Graph/Exchange)
- Proofpoint
- Duo
- SentinelOne

> ⚠️ Do **not** commit real secrets to source control.
