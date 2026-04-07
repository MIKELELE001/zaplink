import { useState, useEffect } from 'react';
import { getCreatorLinks } from '../services/links';
import type { ZapLink, DashboardStats } from '../types';

interface UseDashboardResult {
  links: ZapLink[];
  stats: DashboardStats;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboard(address: string | null): UseDashboardResult {
  const [links, setLinks] = useState<ZapLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    if (!address) { setIsLoading(false); return; }
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCreatorLinks(address);
      setLinks(data);
    } catch {
      setError('Failed to load your links');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void fetchLinks(); }, [address]);

  const stats: DashboardStats = {
    totalEarned: links.filter(l => l.status === 'paid').reduce((sum, l) => sum + parseFloat(l.amount), 0).toFixed(2),
    totalLinks: links.length,
    pendingLinks: links.filter(l => l.status === 'pending').length,
    paidLinks: links.filter(l => l.status === 'paid').length,
  };

  return { links, stats, isLoading, error, refetch: fetchLinks };
}
