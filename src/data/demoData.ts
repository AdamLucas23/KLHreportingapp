
export interface User {
  userPrincipalName?: string;
  assignedLicenses?: number[];
  accountEnabled?: boolean;
  primary_email?: string;
  type?: string;
  is_active?: boolean;
  username?: string;
  email?: string;
  status?: string;
}

export interface SharedMailbox {
  DisplayName: string;
  PrimarySmtpAddress: string;
}

export interface Group {
  displayName: string;
  mail?: string;
}

export interface LicenseInfo {
  assigned: number;
  available: number;
}

export interface Agent {
  account_name: string;
  site_name: string;
  group_name: string;
  device_name: string;
  os_version: string;
  agent_version: string;
  serial_number: string;
  mac_address: string;
}

export interface M365Data {
  licensed: User[];
  unlicensed: User[];
  shared: SharedMailbox[];
  distribution_lists: Group[];
  groups: Group[];
  security_groups: Group[];
  license_utilization: Record<string, LicenseInfo>;
}

export interface ProofpointData {
  users: User[];
}

export interface DuoData {
  users: User[];
}

export interface S1Data {
  account_name: string;
  site_name: string;
  total_agents: number;
  agents: Agent[];
}

export interface ClientData {
  m365?: M365Data;
  pp?: ProofpointData;
  duo?: DuoData;
  s1?: S1Data;
}

// IMPORTANT: The sidebar uses Object.keys(DEMO_CLIENTS) to show client names.
export const DEMO_CLIENTS: Record<string, ClientData> = {
  "Contoso Ltd.": {
    m365: {
      licensed: Array.from({ length: 50 }, (_, i) => ({
        userPrincipalName: `user${i + 1}@contoso.com`,
        assignedLicenses: [1, 2],
        accountEnabled: true,
      })),
      unlicensed: Array.from({ length: 5 }, (_, i) => ({
        userPrincipalName: `guest${i + 1}@contoso.com`,
        assignedLicenses: [],
        accountEnabled: true,
      })),
      shared: Array.from({ length: 7 }, (_, i) => ({
        DisplayName: `Shared Mailbox ${i + 1}`,
        PrimarySmtpAddress: `shared${i + 1}@contoso.com`,
      })),
      distribution_lists: Array.from({ length: 4 }, (_, i) => ({
        displayName: `DL Team ${i + 1}`,
        mail: `dlteam${i + 1}@contoso.com`,
      })),
      groups: Array.from({ length: 5 }, (_, i) => ({
        displayName: `Project Group ${i + 1}`,
        mail: `proj${i + 1}@contoso.com`,
      })),
      security_groups: Array.from({ length: 8 }, (_, i) => ({
        displayName: `SecGroup ${i + 1}`,
        mail: "",
      })),
      license_utilization: {
        "M365 E3": { assigned: 40, available: 10 },
        "B. Premium": { assigned: 8, available: 2 },
        "EXO P2": { assigned: 12, available: 3 },
        "Power BI Pro": { assigned: 6, available: 1 },
      },
    },
    pp: {
      users: [
        ...Array.from({ length: 44 }, (_, i) => ({
          primary_email: `user${i + 1}@contoso.com`,
          type: "paid",
          is_active: true,
        })),
        ...Array.from({ length: 4 }, (_, i) => ({
          primary_email: `svc${i + 1}@contoso.com`,
          type: "functional_account",
          is_active: true,
        })),
      ],
    },
    duo: {
      users: [
        ...Array.from({ length: 39 }, (_, i) => ({
          username: `user${i + 1}`,
          email: `user${i + 1}@contoso.com`,
          status: "active",
        })),
        ...Array.from({ length: 3 }, (_, i) => ({
          username: `temp${i + 1}`,
          email: `temp${i + 1}@contoso.com`,
          status: "disabled",
        })),
      ],
    },
    s1: {
      account_name: "Contoso Parent",
      site_name: "Contoso HQ",
      total_agents: 62,
      agents: [
        ...Array.from({ length: 11 }, (_, i) => ({
          account_name: "Contoso Parent",
          site_name: "Contoso HQ",
          group_name: "Servers",
          device_name: `SRV-${i + 1}`,
          os_version: "Windows Server 2019",
          agent_version: "23.4.1",
          serial_number: `SRV${String(i + 1).padStart(3, "0")}`,
          mac_address: `00:11:22:AA:${(i + 1)
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}:01`,
        })),
        ...Array.from({ length: 39 }, (_, i) => ({
          account_name: "Contoso Parent",
          site_name: "Contoso HQ",
          group_name: "Laptops",
          device_name: `LT-${i + 1}`,
          os_version: "Windows 11 23H2",
          agent_version: "23.4.1",
          serial_number: `LT${String(i + 1).padStart(3, "0")}`,
          mac_address: `00:11:22:BB:${(i + 1)
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}:02`,
        })),
        ...Array.from({ length: 10 }, (_, i) => ({
          account_name: "Contoso Parent",
          site_name: "Contoso HQ",
          group_name: "Desktops",
          device_name: `DT-${i + 1}`,
          os_version: "Windows 10 22H2",
          agent_version: "22.9.5",
          serial_number: `DT${String(i + 1).padStart(3, "0")}`,
          mac_address: `00:11:22:CC:${(i + 1)
            .toString(16)
            .padStart(2, "0")
            .toUpperCase()}:03`,
        })),
      ],
    },
  },

  "Fabrikam Inc.": {
    m365: {
      licensed: Array.from({ length: 19 }, (_, i) => ({
        userPrincipalName: `user${i + 1}@fabrikam.com`,
        assignedLicenses: [1],
        accountEnabled: true,
      })),
      unlicensed: Array.from({ length: 2 }, (_, i) => ({
        userPrincipalName: `ext${i + 1}@fabrikam.com`,
        assignedLicenses: [],
        accountEnabled: true,
      })),
      shared: Array.from({ length: 2 }, (_, i) => ({
        DisplayName: `Shared ${i + 1}`,
        PrimarySmtpAddress: `shared${i + 1}@fabrikam.com`,
      })),
      distribution_lists: [],
      groups: Array.from({ length: 2 }, (_, i) => ({
        displayName: `PG${i + 1}`,
        mail: `pg${i + 1}@fabrikam.com`,
      })),
      security_groups: Array.from({ length: 3 }, (_, i) => ({
        displayName: `Sec${i + 1}`,
        mail: "",
      })),
      license_utilization: {
        "M365 E3": { assigned: 18, available: 2 },
      },
    },
    pp: {
      users: Array.from({ length: 17 }, (_, i) => ({
        primary_email: `user${i + 1}@fabrikam.com`,
        type: "paid",
        is_active: true,
      })),
    },
    duo: {
      users: Array.from({ length: 14 }, (_, i) => ({
        username: `user${i + 1}`,
        email: `user${i + 1}@fabrikam.com`,
        status: "active",
      })),
    },
    s1: {
      account_name: "Fabrikam",
      site_name: "HQ",
      total_agents: 15,
      agents: [],
    },
  },

  "Academic Therapy Publications": {
  },
};

// Scenarios (unchanged)
export type ScenarioType = "Default" | "Light Tenant" | "Security-Heavy" | "Empty";

export const applyScenario = (
  data: ClientData,
  scenario: ScenarioType
): ClientData => {
  const result = JSON.parse(JSON.stringify(data)) as ClientData;

  switch (scenario) {
    case "Light Tenant":
      if (result.m365?.licensed) {
        result.m365.licensed = result.m365.licensed.slice(0, 10);
      }
      if (result.pp?.users) {
        result.pp.users = result.pp.users.slice(0, 12);
      }
      if (result.duo?.users) {
        result.duo.users = result.duo.users.slice(0, 10);
      }
      if (result.s1) {
        result.s1.total_agents = 12;
      }
      break;

    case "Security-Heavy":
      if (result.duo?.users) {
        result.duo.users.push(
          ...Array.from({ length: 5 }, (_, i) => ({
            username: `bypass${i + 1}`,
            email: `bypass${i + 1}@example.com`,
            status: "bypass",
          }))
        );
      }
      if (result.s1) {
        result.s1.total_agents = Math.max(150, result.s1.total_agents);
      }
      break;

    case "Empty":
      return {};

    default:
      break;
  }

  return result;
};
