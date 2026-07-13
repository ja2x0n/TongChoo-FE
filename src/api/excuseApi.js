import { apiClient } from "./client";

export const excuseApi = {
  createExcuse: ({ situation, target, tone }) =>
    apiClient.post("/api/excuses", { situation, target, tone }),

  evolveExcuse: ({ excuseId, direction }) =>
    apiClient.post(`/api/excuses/${excuseId}/evolve`, { direction }),
};
