// src/lib/credentials.ts
// Dev-friendly loader that prefers AWS Secrets Manager but can fall back to local JSON
// Usage:
//   import { loadCompanySecrets } from "./lib/credentials";
//   const data = await loadCompanySecrets();
//   -> returns an array of { key: string, displayName: string, secret: object }

type CompanySecret = {
  key: string;
  displayName: string;
  secret: any;
};

function envFlagTrue(...keys: string[]): boolean {
  const vals = keys.map(k => (import.meta as any).env?.[k] || (typeof process !== 'undefined' ? (process.env as any)?.[k] : undefined));
  return vals.some(v => String(v).toLowerCase() === 'true');
}

async function tryAws(): Promise<CompanySecret[] | null> {
// Placeholder for your existing AWS Secrets Manager integration.
// Return null to indicate not available.
try {
// TODO: integrate your current AWS secrets listing here, something like:
// const secrets = await listSecretsWithPrefix("prod/client-reporting/");
// return secrets.map(s => ({ key: s.name.split('/').pop()!, displayName: s.description || s.name, secret: JSON.parse(s.value) }));
return null;
} catch (e) {
  console.warn("AWS secrets not available:", e);
  return null;
}
}

async function tryLocal(): Promise<CompanySecret[] | null> {
  try {
    const local = await import("../config/put_credentials_here.json");
    // Treat the local file as a single company
    return [{ key: "local-dev", displayName: "Local Dev", secret: (local as any).default ?? local }];
  } catch (e) {
    console.warn("Local creds not available:", e);
    return null;
  }
}

export async function loadCompanySecrets(): Promise<CompanySecret[]> {
  // If flagged, prefer local creds
  const useLocal = envFlagTrue("VITE_USE_LOCAL_CREDS","NEXT_PUBLIC_USE_LOCAL_CREDS","REACT_APP_USE_LOCAL_CREDS");
  if (useLocal) {
    const local = await tryLocal();
    if (local) return local;
  }
  // Try AWS first
  const aws = await tryAws();
  if (aws && aws.length) return aws;

  // Fallback to local if AWS failed
  const local = await tryLocal();
  if (local) return local;

  return [];
}
