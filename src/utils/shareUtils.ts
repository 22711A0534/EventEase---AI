import { EventPlan } from '../types/event';

export function encodePlanToBase64(plan: EventPlan): string {
  try {
    const jsonStr = JSON.stringify(plan);
    // Safe unicode btoa
    const base64 = btoa(
      encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    return encodeURIComponent(base64);
  } catch (err) {
    console.error('Failed to encode plan to base64', err);
    return '';
  }
}

export function decodePlanFromBase64(encoded: string): EventPlan | null {
  try {
    const raw = decodeURIComponent(encoded);
    const jsonStr = decodeURIComponent(
      Array.prototype.map
        .call(atob(raw), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonStr);
    if (parsed && parsed.input && Array.isArray(parsed.budgetBreakdown)) {
      return parsed as EventPlan;
    }
  } catch (err) {
    console.error('Failed to decode plan from base64', err);
  }
  return null;
}

export async function createShareableLink(plan: EventPlan): Promise<string> {
  const origin = window.location.origin || '';
  const pathname = window.location.pathname || '/';

  try {
    const response = await fetch('/api/share-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plan),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.shareId) {
        return `${origin}${pathname}?share=${encodeURIComponent(data.shareId)}`;
      }
    }
  } catch (apiErr) {
    console.warn('Backend share API failed, falling back to URL payload:', apiErr);
  }

  // Robust Client-side URL Hash Fallback
  const payload = encodePlanToBase64(plan);
  return `${origin}${pathname}#plan_data=${payload}`;
}

export async function retrieveSharedPlan(shareId: string): Promise<EventPlan | null> {
  try {
    const response = await fetch(`/api/share-plan/${encodeURIComponent(shareId)}`);
    if (response.ok) {
      const data = await response.json();
      if (data && data.input && Array.isArray(data.budgetBreakdown)) {
        return data as EventPlan;
      }
    }
  } catch (err) {
    console.error('Error fetching shared plan from server:', err);
  }
  return null;
}
