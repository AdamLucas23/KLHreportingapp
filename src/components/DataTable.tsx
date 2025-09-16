import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GlassCard } from "./GlassCard";

interface DataTableProps {
  title: string;
  headers: string[];
  data: Array<Record<string, any>>;
  metrics?: string;
  service?: "m365" | "proofpoint" | "duo" | "s1";
}

export function DataTable({ title, headers, data, metrics, service }: DataTableProps) {
  return (
    <div className="space-y-4">
      <GlassCard service={service}>
        <h2 className="text-2xl font-bold">{title}</h2>
      </GlassCard>
      
      {metrics && (
        <GlassCard service={service}>
          <div className="text-sm" dangerouslySetInnerHTML={{ __html: metrics }} />
        </GlassCard>
      )}
      
      <GlassCard service={service} className="max-h-96 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={index}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header, cellIndex) => (
                  <TableCell key={cellIndex}>
                    {row[Object.keys(row)[cellIndex]] || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </div>
  );
}