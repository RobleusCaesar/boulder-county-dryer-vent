export const PORTAL_SESSION_KEY = "bcdv.portal.demo";

export type PortalSession = {
  demo: true;
  customerId: string;
  email: string;
};

export const DEMO_PORTAL_HINT = "Use the demo button, or any email with password demo.";
