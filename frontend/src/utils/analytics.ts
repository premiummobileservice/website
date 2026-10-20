// Analytics & Conversion Tracking Helper for Google Ads and Meta Pixel

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
  }
}

export const trackLeadSubmitted = (lead: {
  reference: string;
  brand_model?: string;
  repair_needed?: string;
  area?: string;
}) => {
  try {
    // 1. Google Ads & GA4 Lead event
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'engagement',
        event_label: lead.repair_needed || 'Device Repair',
        value: 1,
        transaction_id: lead.reference,
        lead_area: lead.area,
        device_model: lead.brand_model,
      });

      // Optional Google Ads conversion hook
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/LEAD_SUBMITTED',
        value: 1.0,
        currency: 'INR',
        transaction_id: lead.reference,
      });
    }

    // 2. Meta Pixel (if loaded)
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: lead.repair_needed,
        content_category: lead.brand_model,
        currency: 'INR',
      });
    }

    console.info(`[Analytics] Tracked lead conversion: ${lead.reference}`);
  } catch (err) {
    console.debug('[Analytics] Tracking event suppressed:', err);
  }
};
