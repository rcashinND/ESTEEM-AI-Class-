export const PHOTO_LIMIT = 3;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export function validatePhotos(files, existing=0) {
  if (files.length + existing > PHOTO_LIMIT) throw new Error('You can attach up to 3 photos. Remove one before adding another.');
  for (const file of files) {
    if (file.type && file.type !== 'application/octet-stream' && !['image/jpeg','image/png','image/webp'].includes(file.type)) throw new Error('Choose JPEG, PNG or WebP photos. Other file types are not supported.');
    if (!file.size || file.size > MAX_PHOTO_BYTES) throw new Error('Each photo must be a non-empty image no larger than 5 MB.');
  }
}
export function imageTypeFromBytes(bytes) {
  if (bytes[0]===0xff && bytes[1]===0xd8 && bytes[2]===0xff) return 'image/jpeg';
  if ([137,80,78,71,13,10,26,10].every((byte,index)=>bytes[index]===byte)) return 'image/png';
  if (String.fromCharCode(...bytes.slice(0,4))==='RIFF' && String.fromCharCode(...bytes.slice(8,12))==='WEBP') return 'image/webp';
  return null;
}
export async function validatePhotoContent(file) {
  validatePhotos([file]);
  const mime=imageTypeFromBytes(new Uint8Array(await file.slice(0,16).arrayBuffer()));
  if (!mime) throw new Error('That file is not a supported JPEG, PNG or WebP photo. Please choose an image, or continue without photos.');
  return mime;
}
export async function preparePhoto(file) {
  // Some legitimate file pickers omit MIME type. Inspect signatures, not names,
  // and still require actual browser decoding before accepting the attachment.
  await validatePhotoContent(file);
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (image.naturalWidth * image.naturalHeight > 40000000) throw new Error('Image resolution is too large.');
    const scale = Math.min(1,1280/Math.max(image.naturalWidth,image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1,Math.round(image.naturalWidth*scale));
    canvas.height = Math.max(1,Math.round(image.naturalHeight*scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Image preview unavailable.');
    context.fillStyle = '#fff'; context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(image,0,0,canvas.width,canvas.height);
    // Re-encoding removes source metadata and filename from the handoff, not visual content.
    return {dataUrl:canvas.toDataURL('image/jpeg',0.78)};
  } catch { throw new Error('That image could not be opened. Choose a valid, smaller JPEG, PNG or WebP, or continue without a photo.'); }
  finally { URL.revokeObjectURL(url); }
}
