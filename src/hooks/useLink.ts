import { useState, useEffect } from 'react';
import { getLink, incrementViews } from '../services/links';
import type { ZapLink } from '../types';

interface UseLinkResult {
  link: ZapLink | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useLink(linkId: string | undefined): UseLinkResult {
  const [link, setLink] = useState<ZapLink | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLink = async () => {
    if (!linkId) {
      setIsLoading(false);
      setError('No link ID provided');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const res = await getLink(linkId);
      if (res.success && res.link) {
        setLink(res.link);
        await incrementViews(linkId);
      } else {
        setError(res.error ?? 'Link not found');
      }
    } catch {
      setError('Failed to load payment link');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchLink();
  }, [linkId]);

  return { link, isLoading, error, refetch: fetchLink };
}
