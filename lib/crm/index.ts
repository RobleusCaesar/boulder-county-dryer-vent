import { mockCrm } from "@/lib/crm/mock";
import type { CrmClient } from "@/lib/crm/types";

/**
 * Data-layer factory.
 *
 * TODO(supabase): if env has NEXT_PUBLIC_SUPABASE_URL + anon key, return supabaseCrm.
 * Keep the CrmClient interface so marketing, booking, and portal stay unchanged.
 */
export function getCrm(): CrmClient {
  return mockCrm;
}

export type { CrmClient } from "@/lib/crm/types";
