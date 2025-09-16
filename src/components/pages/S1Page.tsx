import { DataTable } from "../DataTable";
import type { S1Data } from "@/data/demoData";

interface S1PageProps {
  data: S1Data | undefined;
}

export function S1Page({ data }: S1PageProps) {
  if (!data) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-lg text-muted-foreground italic">No SentinelOne data available</p>
      </div>
    );
  }

  const metrics = `
    Account: <strong>${data.account_name || "-"}</strong> &nbsp;
    Site: <strong>${data.site_name || "-"}</strong> &nbsp;
    Agents: <strong>${data.total_agents || 0}</strong>
  `;

  const tableData = data.agents?.map(agent => ({
    account_name: agent.account_name,
    site_name: agent.site_name,
    group_name: agent.group_name,
    device_name: agent.device_name,
    os_version: agent.os_version,
    agent_version: agent.agent_version,
    serial_number: agent.serial_number,
    mac_address: agent.mac_address,
  })) || [];

  return (
    <DataTable
      title="SentinelOne"
      headers={[
        "Account Name",
        "Site Name", 
        "Group Name",
        "Device Name",
        "OS Version",
        "Agent Version",
        "Serial Number",
        "MAC Address"
      ]}
      data={tableData}
      metrics={metrics}
      service="s1"
    />
  );
}