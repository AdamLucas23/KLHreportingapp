import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { GlassCard } from "../GlassCard";
import { KPICard } from "../KPICard";
import { RotatingCube } from "../RotatingCube";
import type { ClientData } from "@/data/demoData";

interface SummaryPageProps {
  data: ClientData;
}

const COLORS = ["#7C4DFF", "#00BCD4", "#FF7043", "#8BC34A", "#FFC107", "#E91E63", "#03A9F4", "#9C27B0"];

type FocusService = "m365" | "pp" | "duo" | "s1";

export function SummaryPage({ data }: SummaryPageProps) {
  const [focus, setFocus] = useState<FocusService>("m365");

  const services = [
    { key: "m365", label: "Microsoft 365", enabled: !!data.m365 },
    { key: "pp", label: "Proofpoint", enabled: !!data.pp },
    { key: "duo", label: "Duo", enabled: !!data.duo },
    { key: "s1", label: "SentinelOne", enabled: !!data.s1 },
  ] as const;

  const getKPIMetrics = () => {
    const metrics = [];

    if (data.m365) {
      metrics.push({
        title: "Microsoft 365",
        service: "m365" as const,
        metrics: [
          { label: "Licensed", value: data.m365.licensed?.length || 0 },
          { label: "Unlicensed", value: data.m365.unlicensed?.length || 0 },
          { label: "Shared Mailboxes", value: data.m365.shared?.length || 0 },
          { label: "DLs", value: data.m365.distribution_lists?.length || 0 },
          { label: "M365 Groups", value: data.m365.groups?.length || 0 },
          { label: "Security Groups", value: data.m365.security_groups?.length || 0 },
        ],
      });
    }

    if (data.pp) {
      const paid = data.pp.users?.filter(u => u.type !== "functional_account").length || 0;
      const functional = (data.pp.users?.length || 0) - paid;
      metrics.push({
        title: "Proofpoint",
        service: "proofpoint" as const,
        metrics: [
          { label: "Total Users", value: data.pp.users?.length || 0 },
          { label: "Paid", value: paid },
          { label: "Functional", value: functional },
        ],
      });
    }

    if (data.duo) {
      const statuses = data.duo.users?.reduce((acc, user) => {
        acc[user.status || "unknown"] = (acc[user.status || "unknown"] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      metrics.push({
        title: "Duo",
        service: "duo" as const,
        metrics: [
          { label: "Total Users", value: data.duo.users?.length || 0 },
          { label: "Active", value: statuses.active || 0 },
          { label: "Disabled", value: statuses.disabled || 0 },
          { label: "Bypass", value: statuses.bypass || 0 },
        ],
      });
    }

    if (data.s1) {
      metrics.push({
        title: "SentinelOne",
        service: "s1" as const,
        metrics: [
          { label: "Account", value: data.s1.account_name || "-" },
          { label: "Site", value: data.s1.site_name || "-" },
          { label: "Total Agents", value: data.s1.total_agents || 0 },
        ],
      });
    }

    return metrics;
  };

  const getChartData = () => {
    switch (focus) {
      case "m365":
        if (!data.m365) return { pie: [], bar: [] };
        
        const licenseData = Object.entries(data.m365.license_utilization || {})
          .map(([name, info]) => ({ name, value: info.assigned }))
          .filter(item => item.value > 0)
          .sort((a, b) => b.value - a.value);

        const barData = [
          { name: "Licensed", value: data.m365.licensed?.length || 0 },
          { name: "Unlicensed", value: data.m365.unlicensed?.length || 0 },
          { name: "Shared", value: data.m365.shared?.length || 0 },
        ];

        return { pie: licenseData, bar: barData };

      case "pp":
        if (!data.pp) return { pie: [], bar: [] };
        
        const paid = data.pp.users?.filter(u => u.type !== "functional_account").length || 0;
        const functional = (data.pp.users?.length || 0) - paid;
        const active = data.pp.users?.filter(u => u.is_active).length || 0;
        const inactive = (data.pp.users?.length || 0) - active;

        return {
          pie: [
            { name: "Paid", value: paid },
            { name: "Functional", value: functional },
          ],
          bar: [
            { name: "Active", value: active },
            { name: "Inactive", value: inactive },
          ],
        };

      case "duo":
        if (!data.duo) return { pie: [], bar: [] };
        
        const duoStatuses = data.duo.users?.reduce((acc, user) => {
          acc[user.status || "unknown"] = (acc[user.status || "unknown"] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const duoData = Object.entries(duoStatuses).map(([name, value]) => ({ name, value }));

        return { pie: duoData, bar: duoData };

      case "s1":
        if (!data.s1) return { pie: [], bar: [] };
        
        const groupData = data.s1.agents?.reduce((acc, agent) => {
          acc[agent.group_name] = (acc[agent.group_name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>) || {};

        const s1Data = Object.entries(groupData)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        return { pie: s1Data, bar: s1Data };

      default:
        return { pie: [], bar: [] };
    }
  };

  const chartData = getChartData();

  return (
    <div className="space-y-8 fade-in">
      {/* Focus Controls */}
      <GlassCard className="hover:scale-102 transition-all duration-300">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-lg text-gradient">Summary Focus:</span>
          {services.map((service, index) => (
            <Button
              key={service.key}
              variant={focus === service.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFocus(service.key as FocusService)}
              disabled={!service.enabled}
              className={`btn-modern transition-all duration-300 hover:scale-105 ${
                focus === service.key ? 'shadow-lg' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {service.label}
            </Button>
          ))}
        </div>
      </GlassCard>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {getKPIMetrics().map((metric, index) => (
          <div key={index} className="slide-up" style={{ animationDelay: `${0.1 + index * 0.1}s` }}>
            <KPICard
              title={metric.title}
              metrics={metric.metrics}
              service={metric.service}
            />
          </div>
        ))}
      </div>

      {/* Charts and 3D Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pie Chart */}
        <GlassCard className="h-96 hover:scale-105 transition-all duration-500 group">
          <h3 className="text-xl font-bold mb-6 text-gradient">Distribution</h3>
          {chartData.pie.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={chartData.pie}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  className="drop-shadow-lg"
                >
                  {chartData.pie.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-medium">No data available</div>
                <div className="text-sm opacity-75">Select a different focus</div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* Bar Chart */}
        <GlassCard className="h-96 hover:scale-105 transition-all duration-500 group">
          <h3 className="text-xl font-bold mb-6 text-gradient">Breakdown</h3>
          {chartData.bar.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData.bar} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  stroke="rgba(255, 255, 255, 0.7)"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="rgba(255, 255, 255, 0.7)"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)'
                  }}
                />
                <Bar dataKey="value" fill={COLORS[0]} radius={[8, 8, 0, 0]} className="drop-shadow-lg" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="text-lg font-medium">No data available</div>
                <div className="text-sm opacity-75">Select a different focus</div>
              </div>
            </div>
          )}
        </GlassCard>

        {/* 3D Visualization */}
        <GlassCard className="h-96 hover:scale-105 transition-all duration-500">
          <RotatingCube />
        </GlassCard>
      </div>

      {/* Last Updated */}
      <GlassCard className="hover:scale-102 transition-all duration-300">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">
            Last updated: <span className="text-foreground font-semibold">{new Date().toLocaleString()}</span>
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}