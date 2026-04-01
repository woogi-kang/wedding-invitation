// 결제 관련 타입 정의

export type PricingTier = 'basic' | 'premium' | 'arcade';

export type AddonType =
  | 'lifetime'
  | 'guestsnap_extra_download'
  | 'guestsnap_delayed_download'
  | 'guestsnap_storage_extension'
  | 'premium_bgm'
  | 'extra_gallery'
  | 'custom_domain';

export type PaymentStatus =
  | 'READY'
  | 'IN_PROGRESS'
  | 'DONE'
  | 'CANCELED'
  | 'PARTIAL_CANCELED'
  | 'ABORTED'
  | 'EXPIRED';

export type RefundStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';

export interface PricingInfo {
  tier: PricingTier;
  name: string;
  price: number;
  features: string[];
}

export interface AddonInfo {
  type: AddonType;
  name: string;
  price: number;
  description: string;
  unit?: string;
}

export interface PaymentReadyRequest {
  invitationId: string;
  tier: PricingTier;
  addons: AddonType[];
}

export interface PaymentReadyResponse {
  orderId: string;
  orderName: string;
  amount: number;
  customerEmail?: string;
  customerName?: string;
}

export interface PaymentConfirmRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export interface PaymentConfirmResponse {
  paymentKey: string;
  orderId: string;
  status: PaymentStatus;
  totalAmount: number;
  approvedAt: string;
  method: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  paymentKey: string;
  invitationId: string;
  userId: string;
  tier: PricingTier;
  addons: AddonType[];
  amount: number;
  status: PaymentStatus;
  method: string;
  approvedAt: string;
  createdAt: string;
}

export interface RefundRequest {
  paymentId: string;
  reason: string;
}

export interface RefundInfo {
  id: string;
  paymentId: string;
  amount: number;
  refundRate: number; // 100 or 70
  status: RefundStatus;
  reason: string;
  createdAt: string;
}
