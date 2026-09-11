export type Customer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  zip: string;
  smsConsent: boolean;
  notes: string;
};

export type JobPhoto = {
  id: string;
  caption: string;
  kind: "before" | "after" | "termination" | "issue";
  /** Placeholder only until photo storage is wired. */
  placeholder: true;
};

export type Job = {
  id: string;
  customerId: string;
  status: "scheduled" | "completed" | "canceled" | "due";
  serviceDate: string | null;
  window: string | null;
  priceId: string;
  amount: number;
  summary: string;
  techNotes: string;
  customerNotes: string;
  photos: JobPhoto[];
};

export type Invoice = {
  id: string;
  customerId: string;
  jobId: string | null;
  issuedOn: string;
  amount: number;
  status: "paid" | "open" | "void";
  description: string;
};

export type RescheduleRequest = {
  jobId: string;
  preferredDates: string;
  note: string;
};

export type WaitlistEntry = {
  name: string;
  email: string;
  phone: string;
  zip: string;
  preferredDays: string;
  note: string;
};

export type BookingRequest = {
  city: string;
  zip: string;
  propertyType: "house" | "townhome" | "condo" | "commercial";
  stories: "1" | "2+";
  roofAccess: boolean;
  routeFill: boolean;
  priceId: string;
  amount: number;
  waitlist: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  smsConsent: boolean;
  notes: string;
};

/**
 * CRM port. V1 is a mock. Swap the implementation when Supabase is ready.
 *
 * TODO(supabase): replace mockCrm with a Supabase-backed client.
 * TODO(supabase): customers, jobs, invoices, photos, waitlist, bookings tables.
 * TODO(supabase): Auth for real portal login (magic link or OTP).
 * TODO(supabase): Storage bucket for job photos.
 * TODO(supabase): Edge function or RPC for booking + waitlist writes.
 */
export type CrmClient = {
  getDemoCustomer(): Promise<Customer>;
  getCustomer(id: string): Promise<Customer | null>;
  listJobs(customerId: string): Promise<Job[]>;
  getJob(id: string): Promise<Job | null>;
  listInvoices(customerId: string): Promise<Invoice[]>;
  nextClean(customerId: string): Promise<Job | null>;
  updateSmsConsent(customerId: string, consent: boolean): Promise<Customer>;
  requestReschedule(customerId: string, request: RescheduleRequest): Promise<{ ok: true }>;
  submitWaitlist(entry: WaitlistEntry): Promise<{ ok: true; id: string }>;
  submitBooking(request: BookingRequest): Promise<{ ok: true; confirmationId: string }>;
  listSlots(): Promise<Array<{ id: string; start: string; end: string }>>;
};
