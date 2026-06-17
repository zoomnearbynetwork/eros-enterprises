// @ts-nocheck
"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, LabelList,
  PieChart, Pie, Cell, Legend,
} from "recharts";

type MonthlyRevenue = { month: string; revenue: number }[];
type LeadFunnel = { stage: string; count: number }[];
type InvoiceBreakdown = { name: string; value: number; color: string }[];

interface Props {
  monthlyRevenue: MonthlyRevenue;
  leadFunnel: LeadFunnel;
  invoiceBreakdown: InvoiceBreakdown;
}

const cardStyle = {
  background: "#0F1F3D",
  border: "1px solid rgba(21,101,192,0.22)",
  borderRadius: "12px",
  padding: "16px",
};

const sectionTitle = {
  fontSize: "11px",
  fontWeight: 700,
  color: "rgba(255,255,255,0.5)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  marginBottom: "12px",
};

export function AnalyticsCharts({ monthlyRevenue, leadFunnel, invoiceBreakdown }: Props) {
  const hasRevenue = monthlyRevenue.some(m => m.revenue > 0);
  const hasFunnel = leadFunnel.some(f => f.count > 0);
  const hasPie = invoiceBreakdown.length > 0;

  return (
    <div className="space-y-4">

      {/* Monthly Revenue Bar Chart */}
      <div style={cardStyle}>
        <div style={sectionTitle}>Monthly Revenue (₹)</div>
        {hasRevenue ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyRevenue} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8896AA" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#8896AA" }} axisLine={false} tickLine={false}
                     tickFormatter={(v) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: "#0A1628", border: "1px solid rgba(21,101,192,0.3)", borderRadius: "8px", fontSize: "12px" }}
                labelStyle={{ color: "#E8EAF0" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any) => [`₹${Number(v).toLocaleString("en-IN")}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#1565C0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-[13px]"
               style={{ color: "rgba(255,255,255,0.25)" }}>
            No payment data yet
          </div>
        )}
      </div>

      {/* Lead Funnel */}
      <div style={cardStyle}>
        <div style={sectionTitle}>Lead Pipeline Funnel</div>
        {hasFunnel ? (
          <ResponsiveContainer width="100%" height={200}>
            <FunnelChart>
              <Tooltip
                contentStyle={{ background: "#0A1628", border: "1px solid rgba(21,101,192,0.3)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: number) => [v, "Leads"]}
              />
              <Funnel dataKey="count" data={leadFunnel} isAnimationActive
                      fill="#1565C0" stroke="none">
                <LabelList position="center" style={{ fontSize: 11, fill: "#fff", fontWeight: 600 }}
                           formatter={(v: string | number) => String(v)} />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-[13px]"
               style={{ color: "rgba(255,255,255,0.25)" }}>
            No leads in pipeline yet
          </div>
        )}
      </div>

      {/* Invoice Status Pie */}
      <div style={cardStyle}>
        <div style={sectionTitle}>Invoice Status Breakdown</div>
        {hasPie ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={invoiceBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                   dataKey="value" paddingAngle={3}>
                {invoiceBreakdown.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Legend
                formatter={(value: unknown) => <span style={{ fontSize: 11, color: "#8896AA" }}>{String(value)}</span>}
              />
              <Tooltip
                contentStyle={{ background: "#0A1628", border: "1px solid rgba(21,101,192,0.3)", borderRadius: "8px", fontSize: "12px" }}
                formatter={(v: unknown) => [Number(v), "invoices"]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-[13px]"
               style={{ color: "rgba(255,255,255,0.25)" }}>
            No invoice data yet
          </div>
        )}
      </div>
    </div>
  );
}
