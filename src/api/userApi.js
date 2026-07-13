import { apiClient } from "./client";

export const userApi = {
  getMyRank: () => apiClient.get("/api/users/me/rank"),

  getMyProfile: () => apiClient.get("/api/users/me"),

  updateNickname: ({ nickname }) =>
    apiClient.patch("/api/users/me", { nickname }),

  updatePassword: ({ currentPassword, newPassword }) =>
    apiClient.patch("/api/users/me/password", { currentPassword, newPassword }),
};
