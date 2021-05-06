export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
export const isProduction = process.env.NODE_ENV === 'production';

type Event = {
  event_category?: string;
  event_label?: string;
  page_path?: URL;
  value?: number;
};

declare global {
  interface Window {
    gtag: (type: string, action: string, event: Event) => void;
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL): void => {
  if (isProduction) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

type GTagEvent = {
  action: string;
  category?: string;
  label?: string;
  value?: number;
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: GTagEvent): void => {
  if (isProduction) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};
