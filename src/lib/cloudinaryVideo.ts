function guessVideoMime(url: string): string | undefined {
  const cleanUrl = url.split('?')[0]?.toLowerCase() || '';

  if (cleanUrl.endsWith('.mp4')) return 'video/mp4';
  if (cleanUrl.endsWith('.mov')) return 'video/quicktime';
  if (cleanUrl.endsWith('.webm')) return 'video/webm';

  return undefined;
}

export function getPlayableCloudinaryVideoUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  if (url.includes('/upload/f_mp4,vc_auto,ac_aac,q_auto/')) {
    return url;
  }

  return url.replace('/upload/', '/upload/f_mp4,vc_auto,ac_aac,q_auto/');
}

export function getCloudinaryVideoSources(url: string): Array<{ src: string; type?: string }> {
  if (!url) return [];

  const transformedUrl = getPlayableCloudinaryVideoUrl(url);
  const sources: Array<{ src: string; type?: string }> = [
    { src: url, type: guessVideoMime(url) },
  ];

  if (transformedUrl !== url) {
    sources.push({ src: transformedUrl, type: 'video/mp4' });
  }

  return sources;
}
