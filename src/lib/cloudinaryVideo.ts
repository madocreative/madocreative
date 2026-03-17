export function getPlayableCloudinaryVideoUrl(url: string): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) {
    return url;
  }

  if (url.includes('/upload/f_mp4,vc_auto,ac_aac,q_auto/')) {
    return url;
  }

  return url.replace('/upload/', '/upload/f_mp4,vc_auto,ac_aac,q_auto/');
}
