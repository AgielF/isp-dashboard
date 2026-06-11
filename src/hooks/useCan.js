import { useAuth } from "../contexts/AuthContext"

// Role permissions map
const ROLE_PERMISSIONS = {
  admin: {
    // Full CRUD on everything
    routers: { create: true, read: true, update: true, delete: true },
    clients: { create: true, read: true, update: true, delete: true },
    installations: { create: true, read: true, update: true, delete: true },
    maintenance: { create: true, read: true, update: true, delete: true },
    billing: { create: true, read: true, update: true, delete: true },
    financial: { read: true },
  },
  operator: {
    routers: { create: true, read: true, update: true, delete: false },
    clients: { create: true, read: true, update: true, delete: false },
    installations: { create: true, read: true, update: true, delete: false },
    maintenance: { create: true, read: true, update: true, delete: false },
    billing: { create: false, read: false, update: false, delete: false },
    financial: { read: false },
  },
  finance: {
    routers: { create: false, read: false, update: false, delete: false },
    clients: { create: false, read: false, update: false, delete: false },
    installations: { create: false, read: false, update: false, delete: false },
    maintenance: { create: false, read: false, update: false, delete: false },
    billing: { create: true, read: true, update: true, delete: false },
    financial: { read: true },
  },
  technician: {
    routers: { create: false, read: false, update: false, delete: false },
    clients: { create: false, read: false, update: false, delete: false },
    installations: { create: false, read: true, update: true, delete: false },
    maintenance: { create: false, read: true, update: true, delete: false },
    billing: { create: false, read: false, update: false, delete: false },
    financial: { read: false },
  },
}

/**
 * Hook for checking user permissions based on role
 * @returns {{ can: (module: string, action: string) => boolean, role: string }}
 */
export function useCan() {
  const { user } = useAuth()
  const role = user?.role || "admin"
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.admin

  const can = (module, action) => {
    return permissions[module]?.[action] || false
  }

  return { can, role }
}
