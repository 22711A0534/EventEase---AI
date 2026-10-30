import confetti from 'canvas-confetti';

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function formatCompactINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(amount % 10000000 === 0 ? 0 : 2);
    return `₹${cr} Crore`;
  }
  if (amount >= 100000) {
    const lk = (amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2);
    return `₹${lk} Lakh`;
  }
  if (amount >= 1000) {
    const k = (amount / 1000).toFixed(0);
    return `₹${k}K`;
  }
  return `₹${amount}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'TBD';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function getCountdown(targetDate: string): { days: number; hours: number; isPast: boolean } {
  if (!targetDate) return { days: 0, hours: 0, isPast: false };
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff < 0) {
    return { days: 0, hours: 0, isPast: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours, isPast: false };
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b']
    });
  } catch (e) {
    // ignore if canvas not supported
  }
}
