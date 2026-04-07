import type { CreateLinkRequest, CreateLinkResponse, GetLinkResponse, UpdateLinkRequest, UpdateLinkResponse, ZapLink } from '../types';

const BASE = '/api/links';

export async function createLink(data: CreateLinkRequest): Promise<CreateLinkResponse> {
  try {
    const res = await fetch(`${BASE}/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as CreateLinkResponse;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create link' };
  }
}

export async function getLink(linkId: string): Promise<GetLinkResponse> {
  try {
    const res = await fetch(`${BASE}/${linkId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as GetLinkResponse;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to fetch link' };
  }
}

export async function updateLink(data: UpdateLinkRequest): Promise<UpdateLinkResponse> {
  try {
    const res = await fetch(`${BASE}/update`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json() as UpdateLinkResponse;
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to update link' };
  }
}

export async function getCreatorLinks(address: string): Promise<ZapLink[]> {
  try {
    const res = await fetch(`${BASE}/creator/${address}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as { success: boolean; links?: ZapLink[] };
    return data.links ?? [];
  } catch { return []; }
}

export async function incrementViews(linkId: string): Promise<void> {
  try { await fetch(`${BASE}/view/${linkId}`, { method: 'POST' }); } catch {}
}
