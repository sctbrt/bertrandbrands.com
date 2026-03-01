// Shared TypeScript types for API endpoints

// ============================================
// DATABASE ROW TYPES
// ============================================

export interface MagicLinkRow {
  id: string;
  email: string;
}

export interface PricingSessionRow {
  id: string;
  email: string;
  expires_at: string;
}

export interface BookingTokenRow {
  id: string;
  client_id: string;
  booking_type: string;
}

export interface BookingSessionRow {
  id: string;
  client_id: string;
  booking_type: string;
  client_email: string;
  expires_at: string;
}

export interface ClientRow {
  contact_email: string;
}

// ============================================
// DB FUNCTION PARAMS
// ============================================

export interface CreateMagicLinkParams {
  email: string;
  tokenHash: string;
  expiresAt: string;
}

export interface CreatePricingSessionParams {
  email: string;
  expiresAt: string;
}

export interface CreateBookingTokenParams {
  clientId: string;
  bookingType: string;
  tokenHash: string;
  expiresAt: string;
  createdBy: string;
}

export interface CreateBookingSessionParams {
  clientId: string;
  bookingType: string;
  clientEmail: string;
  expiresAt: string;
}

// ============================================
// RATE LIMITER
// ============================================

export interface RateLimitEntry {
  windowStart: number;
  count: number;
}

// ============================================
// COOKIE OPTIONS
// ============================================

export interface BuildCookieOptions {
  hostname?: string;
}

// ============================================
// ERROR PAGE OPTIONS
// ============================================

export interface ErrorPageOptions {
  backHref?: string;
  backLabel?: string;
}

// ============================================
// REQUEST BODY TYPES
// ============================================

export interface NotifyVisitorBody {
  type: 'visitor';
  page?: string;
  referrer?: string;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    gclid?: string;
  };
}

export interface NotifyIntakeBody {
  type: 'intake';
  source?: string;
  name?: string;
  email?: string;
  phone?: string;
  business?: string;
  website?: string;
  service?: string;
  situation?: string;
  budget?: string;
  timeline?: string;
  concerns?: string;
  details?: string;
  description?: string;
  challenge?: string;
  context?: string;
  outcome?: string;
  tier?: string;
  price?: string;
  offer?: string;
  industry?: string;
  contact_pref?: string;
}

export interface NotifyFormBody {
  type?: string;
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

export type NotifyRequestBody = NotifyVisitorBody | NotifyIntakeBody | NotifyFormBody;

export interface SnapshotBookBody {
  name: string;
  email: string;
  website: string;
  concern?: string;
  source?: string;
  offer?: string;
  rate?: string;
}

export interface PricingRequestAccessBody {
  email?: string;
  firstName?: string;
}

// ============================================
// CALENDLY MAP
// ============================================

export interface CalendlyEntry {
  url: string;
  active: boolean;
}

// ============================================
// PUSHOVER PAYLOAD
// ============================================

export interface PushoverPayload {
  token: string;
  user: string;
  message: string;
  title: string;
  url?: string;
  url_title?: string;
  priority: number;
  sound?: string;
}
