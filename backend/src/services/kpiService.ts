import { fetchKpiCounts } from "../db/repositories/moduleRepository";

export interface KpiResponse {
  appointments: number;
  activeServices: number;
  completedServices: number;
  revenue: string;
  customers: number;
}

export async function getDashboardKpis(): Promise<KpiResponse> {
  const counts = await fetchKpiCounts();

  return {
    appointments: counts.appointments,
    activeServices: counts.activeServices,
    completedServices: counts.completedServices,
    revenue: "₹24.8L",
    customers: counts.customers,
  };
}
