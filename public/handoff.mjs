export const HANDOFF_KEY = 'trawd.submitted-brief.v2';
export const MAX_AGE = 60 * 60 * 1000;
const fields = ['job','trades','area','timing','urgency','materials','concern','safety','mode','uncertainty','photoNotice'];
const clean = value => typeof value === 'string' ? value.slice(0,600) : '';

export function handoffPayload(brief, photos=[], now=Date.now()) {
  if (!Array.isArray(photos) || photos.length > 3) throw new Error('Attach no more than 3 photos.');
  const summary = Object.fromEntries(fields.map(key=>[key,clean(brief[key])]));
  summary.scope = (Array.isArray(brief.scope) ? brief.scope : []).slice(0,5).map(clean);
  summary.followUp = (Array.isArray(brief.followUp) ? brief.followUp : []).slice(0,7).map(clean);
  const images = photos.slice(0,3).map(photo=>({dataUrl:photo.dataUrl}));
  if (images.some(p=>typeof p.dataUrl !== 'string' || !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(p.dataUrl))) throw new Error('A photo could not be attached. Remove it and try again.');
  const payload = {version:2, submittedAt:now, summary, photos:images};
  if (JSON.stringify(payload).length > 3500000) throw new Error('The photos are too large for this tab. Remove a photo or submit without photos.');
  return payload;
}

export function saveHandoff(storage, brief, photos=[], now=Date.now()) {
  const payload = handoffPayload(brief,photos,now);
  try { storage.removeItem(HANDOFF_KEY); storage.setItem(HANDOFF_KEY,JSON.stringify(payload)); }
  catch { clearHandoff(storage); throw new Error('This browser could not keep the brief in this tab. Allow session storage or remove photos and try again.'); }
  return payload;
}
export function clearHandoff(storage) {
  try { storage.removeItem(HANDOFF_KEY); } catch { /* Never reuse an unreadable handoff. */ }
}
export function readHandoff(storage, now=Date.now()) {
  try {
    const payload = JSON.parse(storage.getItem(HANDOFF_KEY));
    if (payload?.version !== 2 || !Number.isFinite(payload.submittedAt) || now-payload.submittedAt > MAX_AGE || now < payload.submittedAt || !payload.summary?.job || !Array.isArray(payload.photos)) throw new Error('No current brief');
    if (fields.some(key=>typeof payload.summary[key] !== 'string') || !Array.isArray(payload.summary.scope) || !Array.isArray(payload.summary.followUp)) throw new Error('Invalid brief');
    return handoffPayload(payload.summary,payload.photos,payload.submittedAt);
  } catch { clearHandoff(storage); return null; }
}
