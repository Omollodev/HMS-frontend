import { apiClient } from "./api-client"

export async function login(email: string, password: string) {
  const response = await apiClient.post("/auth/token/", {
    email,
    password,
  })
  return response.data
}

export async function refreshToken(refresh: string) {
  const response = await apiClient.post("/auth/token/refresh/", {
    refresh,
  })
  return response.data
}

export async function getUserProfile() {
  const response = await apiClient.get("/auth/users/me/")
  return response.data
}

export async function register(userData: {
  email: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
  role?: string
}) {
  const response = await apiClient.post("/auth/users/register/", userData)
  return response.data
}

export async function changePassword(oldPassword: string, newPassword: string, newPasswordConfirm: string) {
  const response = await apiClient.post("/auth/users/change_password/", {
    old_password: oldPassword,
    new_password: newPassword,
    new_password_confirm: newPasswordConfirm,
  })
  return response.data
}

