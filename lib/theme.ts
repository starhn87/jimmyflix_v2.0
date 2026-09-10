export type Theme = 'dark' | 'light'

export const THEME_STORAGE_KEY = 'jimmyflix-theme-v1'
export const THEME_CHANGE_EVENT = 'jimmyflix-theme-change'
export const THEME_COLORS = { dark: '#0b0912', light: '#faf8ff' } as const

// Runs before first paint; only fixed application values are interpolated.
export const themeScript = `(() => {
  let saved;
  try { saved = localStorage.getItem('${THEME_STORAGE_KEY}'); } catch {}
  const theme = saved === 'light' || saved === 'dark'
    ? saved : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content',
    theme === 'dark' ? '${THEME_COLORS.dark}' : '${THEME_COLORS.light}');
})();`
