import { useState } from 'react';

// Mock admin state — in production this would come from auth
export function useAdmin() {
  const [isAdmin] = useState(true); // Default to admin for demo
  return isAdmin;
}
