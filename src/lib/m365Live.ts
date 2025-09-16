// src/lib/m365Live.ts
// Minimal live M365 loader that matches your ClientData/M365Data shape

type LicenseInfo = { assigned: number; available: number };
type M365Data = {
  licensed: any[];
  unlicensed: any[];
  shared: { DisplayName: string; PrimarySmtpAddress: string }[];
  distribution_lists: { displayName: string; mail?: string }[];
  groups: { displayName: string; mail?: string }[];
  security_groups: { displayName: string; mail?: string }[];
  license_utilization: Record<string, LicenseInfo>;
};

type ClientData = { m365?: M365Data };

type LocalCreds = {
  m365: {
    tenant_id: string;
    client_id: string;
    client_secret: string;
  };
};

// NOTE: this imports your local creds JSON when VITE_USE_LOCAL_CREDS=true.
// The relative path assumes your file is at project-root/config/put_credentials_here.json
async function getLocalCreds(): Promise<LocalCreds["m365"]> {
  const mod = await import("../../config/put_credentials_here.json");
  return (mod as any).default?.m365 ?? (mod as any).m365;
}

async function getToken(tenant: string, clientId: string, clientSecret: string): Promise<string> {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  const res = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token error ${res.status}: ${text}`);
  }
  const json = await res.json();
  return json.access_token as string;
}

async function g<T>(token: string, url: string): Promise<T> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Graph ${res.status} ${url}: ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function loadM365LiveData(): Promise<ClientData> {
  // guard – only allow from local creds in dev
  if (import.meta.env.PROD) throw new Error("Live loader is dev-only in this sample.");
  if (import.meta.env.VITE_USE_LOCAL_CREDS !== "true")
    throw new Error("Set VITE_USE_LOCAL_CREDS=true when starting the dev server.");

  const { tenant_id, client_id, client_secret } = await getLocalCreds();
  const token = await getToken(tenant_id, client_id, client_secret);

  // Pull a few useful datasets (keep it light)
  // Users (licensed vs unlicensed) – sample: looking at assignedLicenses array
  type UsersResp = { value: Array<{ userPrincipalName: string; accountEnabled?: boolean; assignedLicenses?: any[] }> };
  const users = await g<UsersResp>(
    token,
    "https://graph.microsoft.com/v1.0/users?$select=userPrincipalName,accountEnabled,assignedLicenses&$top=999"
  );

  const licensed = users.value.filter(u => (u.assignedLicenses?.length ?? 0) > 0);
  const unlicensed = users.value.filter(u => (u.assignedLicenses?.length ?? 0) === 0);

  // Shared mailboxes (Exchange shared mailboxes use resource type; simplest heuristic via displayName/mailNickname)
  // If you have an EWS/EXO endpoint, prefer that. For demo we’ll map none:
  const shared: M365Data["shared"] = [];

  // Distribution lists & M365 groups
  type GroupsResp = { value: Array<{ displayName: string; mail?: string; groupTypes?: string[]; securityEnabled?: boolean }> };
  const groupsResp = await g<GroupsResp>(
    token,
    "https://graph.microsoft.com/v1.0/groups?$select=displayName,mail,groupTypes,securityEnabled&$top=999"
  );

  const distribution_lists = groupsResp.value.filter(g => !g.groupTypes?.includes("Unified") && !g.securityEnabled)
    .map(g => ({ displayName: g.displayName, mail: g.mail }));
  const groups = groupsResp.value.filter(g => g.groupTypes?.includes("Unified"))
    .map(g => ({ displayName: g.displayName, mail: g.mail }));
  const security_groups = groupsResp.value.filter(g => g.securityEnabled)
    .map(g => ({ displayName: g.displayName, mail: g.mail }));

  // License utilization – very rough example based on assigned counts only
  // (For precise counts per SKU, query /subscribedSkus and aggregate by skuPartNumber & consumedUnits)
  type SkusResp = { value: Array<{ skuPartNumber: string; consumedUnits: number; prepaidUnits?: { enabled?: number } }> };
  const skus = await g<SkusResp>(token, "https://graph.microsoft.com/v1.0/subscribedSkus");
  const license_utilization: Record<string, LicenseInfo> = {};
  for (const s of skus.value) {
    const assigned = s.consumedUnits ?? 0;
    const available = (s.prepaidUnits?.enabled ?? 0) - assigned;
    license_utilization[s.skuPartNumber] = { assigned, available: Math.max(available, 0) };
  }

  const m365: M365Data = {
    licensed,
    unlicensed,
    shared,
    distribution_lists,
    groups,
    security_groups,
    license_utilization,
  };

  return { m365 };
}
