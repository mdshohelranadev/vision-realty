"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, CheckCircle2, Hammer, Inbox, Rocket, type LucideIcon } from "lucide-react";
import { Pill } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

const COLORS = ["#1A5C3A", "#C89B3C", "#0F172A"];

export default function AdminDashboardPage() {
  const projects = useStore((s) => s.projects);
  const inquiries = useStore((s) => s.inquiries);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const stats: { label: string; value: number; Icon: LucideIcon; tone: string }[] = useMemo(
    () => [
      { label: "Total Projects", value: projects.length, Icon: Building2, tone: "bg-primary text-white" },
      { label: "Complete", value: projects.filter((p) => p.category === "complete").length, Icon: CheckCircle2, tone: "bg-primary-50 text-primary" },
      { label: "Ongoing", value: projects.filter((p) => p.category === "ongoing").length, Icon: Hammer, tone: "bg-accent-50 text-accent-500" },
      { label: "Upcoming", value: projects.filter((p) => p.category === "upcoming").length, Icon: Rocket, tone: "bg-slate-100 text-slate-700" },
      { label: "Inquiries", value: inquiries.length, Icon: Inbox, tone: "bg-primary-50 text-primary" },
    ],
    [projects, inquiries]
  );

  const byLocation = useMemo(() => {
    const map = new Map<string, number>();
    projects.forEach((p) => {
      const key = p.area.replace(" R/A", "").replace("Dhaka ", "") || "Other";
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return Array.from(map, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [projects]);

  const byCategory = useMemo(
    () => [
      { name: "Complete", value: projects.filter((p) => p.category === "complete").length },
      { name: "Ongoing", value: projects.filter((p) => p.category === "ongoing").length },
      { name: "Upcoming", value: projects.filter((p) => p.category === "upcoming").length },
    ],
    [projects]
  );

  const recent = inquiries.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map(({ label, value, Icon, tone }, i) => (
          <div
            key={label}
            className={`card-base p-5 shadow-soft ${i === 0 ? "col-span-2 lg:col-span-1" : ""}`}
          >
            <span className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}>
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <p className="font-serif text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card-base p-5 shadow-soft lg:col-span-3" aria-labelledby="chart-location">
          <h2 id="chart-location" className="font-serif text-lg font-semibold">
            Projects by location
          </h2>
          <div className="mt-4 h-72">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byLocation} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "rgba(26,92,58,0.06)" }} />
                  <Bar dataKey="count" name="Projects" fill="#1A5C3A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="card-base p-5 shadow-soft lg:col-span-2" aria-labelledby="chart-category">
          <h2 id="chart-category" className="font-serif text-lg font-semibold">
            Projects by category
          </h2>
          <div className="mt-4 h-72">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byCategory}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {byCategory.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={32} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
      </div>

      <section className="card-base shadow-soft" aria-labelledby="recent-inquiries">
        <div className="flex items-center justify-between p-5">
          <h2 id="recent-inquiries" className="font-serif text-lg font-semibold">
            Recent inquiries
          </h2>
          <Link href="/admin/inquiries" className="text-sm font-semibold text-primary dark:text-accent">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-5 pb-8 text-center text-sm text-slate-500">No inquiries have been received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-y border-slate-100 bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 font-semibold sm:px-5">Name</th>
                  <th className="hidden px-5 py-3 font-semibold sm:table-cell">Project</th>
                  <th className="hidden px-5 py-3 font-semibold md:table-cell">Phone</th>
                  <th className="px-4 py-3 font-semibold sm:px-5">Date</th>
                  <th className="px-4 py-3 font-semibold sm:px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recent.map((i) => (
                  <tr key={i.id}>
                    <td className="px-4 py-3.5 font-medium sm:px-5">{i.name}</td>
                    <td className="hidden px-5 py-3.5 text-slate-600 dark:text-slate-400 sm:table-cell">{i.projectName ?? "General"}</td>
                    <td className="hidden px-5 py-3.5 md:table-cell">{i.phone}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-slate-600 dark:text-slate-400 sm:px-5">{formatDate(i.createdAt)}</td>
                    <td className="px-4 py-3.5 sm:px-5">
                      <Pill tone={i.status === "new" ? "gold" : "slate"}>{i.status === "new" ? "New" : "Read"}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
