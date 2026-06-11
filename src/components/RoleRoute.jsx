import { Navigate } from "react-router-dom"
import { useCan } from "../hooks/useCan"

// Module -> required read permission
const MODULE_PERMISSIONS = {
  routers: "read",
  clients: "read",
  installations: "read",
  maintenance: "read",
  billing: "read",
  financial: "read",
}

/**
 * Route wrapper that checks if the current role has read access to the module.
 * If not, redirects to dashboard.
 */
export default function RoleRoute({ module, children }) {
  const { can } = useCan()
  const action = MODULE_PERMISSIONS[module]

  if (!can(module, action)) {
    return <Navigate to="/" replace />
  }

  return children
}
