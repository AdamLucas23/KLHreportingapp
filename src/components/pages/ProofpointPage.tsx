import { DataTable } from "../DataTable";
import type { ProofpointData } from "@/data/demoData";

interface ProofpointPageProps {
  data: ProofpointData | undefined;
}

export function ProofpointPage({ data }: ProofpointPageProps) {
  if (!data) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-lg text-muted-foreground italic">No Proofpoint data available</p>
      </div>
    );
  }

  const paid = data.users?.filter(u => u.type !== "functional_account").length || 0;
  const functional = (data.users?.length || 0) - paid;

  const metrics = `
    Users: <strong>${data.users?.length || 0}</strong> &nbsp;
    Paid: <strong>${paid}</strong> &nbsp;
    Functional: <strong>${functional}</strong>
  `;

  const tableData = data.users?.map(user => ({
    email: user.primary_email || "",
    type: user.type || "",
    status: user.is_active ? "Active" : "Inactive",
  })) || [];

  return (
    <DataTable
      title="Proofpoint"
      headers={["Email", "Type", "Status"]}
      data={tableData}
      metrics={metrics}
      service="proofpoint"
    />
  );
}