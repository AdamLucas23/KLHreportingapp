import { DataTable } from "../DataTable";
import type { DuoData } from "@/data/demoData";

interface DuoPageProps {
  data: DuoData | undefined;
}

export function DuoPage({ data }: DuoPageProps) {
  if (!data) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-lg text-muted-foreground italic">No Duo data available</p>
      </div>
    );
  }

  const statuses = data.users?.reduce((acc, user) => {
    acc[user.status || "unknown"] = (acc[user.status || "unknown"] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const metrics = `
    Users: <strong>${data.users?.length || 0}</strong> &nbsp;
    Active: <strong>${statuses.active || 0}</strong> &nbsp;
    Disabled: <strong>${statuses.disabled || 0}</strong> &nbsp;
    Bypass: <strong>${statuses.bypass || 0}</strong>
  `;

  const tableData = data.users?.map(user => ({
    username: user.username || "",
    email: user.email || "",
    status: user.status || "",
  })) || [];

  return (
    <DataTable
      title="Duo Security"
      headers={["Username", "Email", "Status"]}
      data={tableData}
      metrics={metrics}
      service="duo"
    />
  );
}