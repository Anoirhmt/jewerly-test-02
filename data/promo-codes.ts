export const promoCodes = [
  // Percent discount example: 20% off, active all year, max 500 uses, 1 per user, min subtotal 300 MAD
  {
    code: "SUMMER20",
    type: "percent",
    value: 0.20,
    active: true,
    startAt: "2025-01-01",
    endAt: "2025-12-31",
    maxUses: 500,
    perUserLimit: 1,
    minSubtotal: 300,
  },

  // Fixed discount example: 100 MAD off, limited to first 10 uses, one per phone number
  {
    code: "FIRST10",
    type: "fixed",
    value: 100,
    active: true,
    maxUses: 10,
    perUserLimit: 1,
    message: "100 MAD off your first order",
  },

  // Free shipping example: only for Rabat & Casablanca
  {
    code: "987654",
    type: "free_shipping",
    value: 0,
    active: true,
    eligibleCities: ["Rabat", "Casablanca"],
  },

  // Legacy style kept for compatibility: the API will treat this as percent 15%
  { code: "SAVE15", discount: 0.15 },
];