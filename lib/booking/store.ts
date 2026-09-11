import type { BookingRequest } from "@/lib/crm/types";

export const BOOKING_STORAGE_KEY = "bcdv.booking.v1";
export const CONFIRMATION_STORAGE_KEY = "bcdv.confirmation.v1";

export type BookingDraft = Partial<BookingRequest> & {
  step?: number;
};

export const emptyDraft: BookingDraft = {
  step: 0,
  city: "",
  zip: "",
  propertyType: "house",
  stories: "1",
  roofAccess: false,
  routeFill: false,
  waitlist: true,
  smsConsent: false,
  notes: "",
};
