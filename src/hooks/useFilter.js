import { useState } from 'react'

// Shared hook for filtering by user across tabs
// Returns selected user slug (or null for "all"), and a setter
export function useFilter() {
  const [selectedUser, setSelectedUser] = useState(null)

  const toggleUser = (slug) => {
    setSelectedUser(prev => prev === slug ? null : slug)
  }

  return { selectedUser, setSelectedUser, toggleUser }
}
