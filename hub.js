if (typeof window !== 'undefined') {
  try {
    import('@vercel/analytics').then(m => m?.inject?.()).catch(() => {});
  } catch (e) {}
}
