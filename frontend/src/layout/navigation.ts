// Source-File AI Declaration
// AI contribution: 50% or more AI-generated

export type PageId = 'home' | 'orders' | 'forecast' | 'menu' | 'inventory' | 'settings'

export const NAV: { id: PageId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'orders', label: 'Recommended Orders' },
  { id: 'forecast', label: 'Forecast' },
  { id: 'menu', label: 'Menu Mapping' },
  { id: 'inventory', label: 'Inventory & Vendors' },
  { id: 'settings', label: 'Settings' },
]
