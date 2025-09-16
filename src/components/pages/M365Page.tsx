import { DataTable } from "../DataTable";
import type { M365Data } from "@/data/demoData";

interface M365PageProps {
  data: M365Data | undefined;
}

export function M365Page({ data }: M365PageProps) {
  if (!data) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-lg text-muted-foreground italic">No Microsoft 365 data available</p>
      </div>
    );
  }

  const metrics = `
    Licensed: <strong>${data.licensed?.length || 0}</strong> &nbsp;
    Shared: <strong>${data.shared?.length || 0}</strong> &nbsp;
    Unlicensed: <strong>${data.unlicensed?.length || 0}</strong> &nbsp;
    DLs: <strong>${data.distribution_lists?.length || 0}</strong> &nbsp;
    M365 Groups: <strong>${data.groups?.length || 0}</strong> &nbsp;
    Security Groups: <strong>${data.security_groups?.length || 0}</strong>
  `;

  const tableData = data.licensed?.map(user => ({
    userPrincipalName: user.userPrincipalName || "",
    licenses: (user.assignedLicenses?.length || 0).toString(),
    status: user.accountEnabled ? "Active" : "Disabled",
  })) || [];

  return (
    <DataTable
      title="Microsoft 365"
      headers={["User Principal Name", "Licenses", "Status"]}
      data={tableData}
      metrics={metrics}
      service="m365"
    />
  );
}