import * as zod from "zod";

export const HealthStatus = zod.object({
  status: zod.string(),
});

export const HealthCheckResponse = HealthStatus;
export type HealthStatusType = zod.infer<typeof HealthStatus>;
