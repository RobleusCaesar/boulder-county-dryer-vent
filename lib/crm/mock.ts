import { prices } from "@/lib/pricing";
import type { CrmClient, Customer, Invoice, Job } from "@/lib/crm/types";

const demoCustomer: Customer = {
  id: "cus_demo_hale",
  firstName: "Jordan",
  lastName: "Hale",
  email: "jordan.hale@example.com",
  phone: "(303) 555-0142",
  addressLine1: "1842 Mapleton Ave",
  city: "Boulder",
  state: "CO",
  zip: "80304",
  smsConsent: true,
  notes: "Roof termination on the north side. Dog in the backyard — please close the gate.",
};

const demoJobs: Job[] = [
  {
    id: "job_2025_0912",
    customerId: demoCustomer.id,
    status: "completed",
    serviceDate: "2025-09-12",
    window: "10:00am–12:00pm",
    priceId: prices.standard.id,
    amount: prices.standard.amount,
    summary: "Standard dryer vent clean. Heavy lint at the mid-run elbow.",
    techNotes: "Brushed 28 ft of 4-in rigid. Termination flap now swings freely. Recommend 12-month interval.",
    customerNotes: "Please text on the way.",
    photos: [
      { id: "ph1", caption: "Termination before", kind: "before", placeholder: true },
      { id: "ph2", caption: "Lint pulled from the run", kind: "after", placeholder: true },
      { id: "ph3", caption: "Roof cap after", kind: "termination", placeholder: true },
    ],
  },
  {
    id: "job_2026_1018",
    customerId: demoCustomer.id,
    status: "scheduled",
    serviceDate: "2026-10-18",
    window: "1:00pm–3:00pm",
    priceId: prices.annual.id,
    amount: prices.annual.amount,
    summary: "Annual plan visit.",
    techNotes: "",
    customerNotes: "Gate code in the lockbox if no one is home.",
    photos: [],
  },
];

const demoInvoices: Invoice[] = [
  {
    id: "inv_10021",
    customerId: demoCustomer.id,
    jobId: "job_2025_0912",
    issuedOn: "2025-09-12",
    amount: 129,
    status: "paid",
    description: "Standard dryer vent clean",
  },
  {
    id: "inv_10088",
    customerId: demoCustomer.id,
    jobId: "job_2026_1018",
    issuedOn: "2026-09-01",
    amount: 109,
    status: "open",
    description: "Annual plan — next clean",
  },
];

export const mockCrm: CrmClient = {
  async getDemoCustomer() {
    return demoCustomer;
  },

  async getCustomer(id) {
    return id === demoCustomer.id ? demoCustomer : null;
  },

  async listJobs(customerId) {
    return demoJobs.filter((job) => job.customerId === customerId);
  },

  async getJob(id) {
    return demoJobs.find((job) => job.id === id) ?? null;
  },

  async listInvoices(customerId) {
    return demoInvoices.filter((invoice) => invoice.customerId === customerId);
  },

  async nextClean(customerId) {
    const upcoming = demoJobs
      .filter((job) => job.customerId === customerId && (job.status === "scheduled" || job.status === "due"))
      .sort((a, b) => (a.serviceDate || "").localeCompare(b.serviceDate || ""));
    return upcoming[0] ?? null;
  },

  async updateSmsConsent(customerId, consent) {
    if (customerId !== demoCustomer.id) {
      throw new Error("Demo CRM only has one customer.");
    }
    demoCustomer.smsConsent = consent;
    return { ...demoCustomer };
  },

  async requestReschedule() {
    // TODO(supabase): insert into reschedule_requests and notify ops.
    return { ok: true as const };
  },

  async submitWaitlist() {
    // TODO(supabase): insert waitlist row; notify ops Slack/email.
    return { ok: true as const, id: `wl_${Date.now()}` };
  },

  async submitBooking() {
    // TODO(supabase): create customer + booking + optional deposit intent.
    return { ok: true as const, confirmationId: `BCDV-${Date.now().toString().slice(-8)}` };
  },

  async listSlots() {
    // Honest empty calendar until a real schedule source exists.
    // TODO(supabase): read published capacity from schedule / calendar tables.
    return [];
  },
};

export const demoJobIds = demoJobs.map((job) => job.id);
