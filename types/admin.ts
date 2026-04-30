export type OrderStatus = 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'returned' | 'cancelled'
export type OrderSource = 'website' | 'whatsapp' | 'tiktok'
export type ReturnStatus = 'en_attente' | 'en_transit_retour' | 'recu' | 'non_recu'

export interface Order {
  id: string
  trackingNumber: string
  customerName: string
  customerPhone: string
  address: string
  city: string
  items: string
  total: number
  status: OrderStatus
  source: OrderSource
  createdAt: string
  notes?: string
}

export interface Return {
  id: string
  orderId: string
  trackingNumber: string
  customerName: string
  customerPhone: string
  city: string
  items: string
  total: number
  returnStatus: ReturnStatus
  createdAt: string
  receivedAt?: string
  reason?: string
  scannedCode?: string
}

export interface CreateShipmentData {
  customerName: string
  customerPhone: string
  address: string
  city: string
  items: string
  total: number
  source: OrderSource
  notes?: string
}
