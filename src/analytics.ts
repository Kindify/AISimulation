// Lightweight event tracking via Google Sheets webhook
// Events are fire-and-forget — failures are silently ignored

const WEBHOOK_URL = import.meta.env.VITE_ANALYTICS_WEBHOOK || "";

interface TrackEvent {
  event: string;
  [key: string]: string | number | boolean | undefined;
}

export function track(eventName: string, properties: Record<string, string | number | boolean | undefined> = {}) {
  if (!WEBHOOK_URL) return;

  const payload: TrackEvent = {
    event: eventName,
    timestamp: new Date().toISOString(),
    session_id: getSessionId(),
    page_url: window.location.href,
    ...properties,
  };

  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(WEBHOOK_URL, body);
    } else {
      fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Silently ignore — tracking should never break the app
  }
}

function getSessionId(): string {
  let id = sessionStorage.getItem("_sid");
  if (!id) {
    id = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    sessionStorage.setItem("_sid", id);
  }
  return id;
}
