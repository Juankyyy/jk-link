import { computed, ref } from 'vue'

const THEME_STORAGE_KEY = 'jk-link-theme'
const isDark = ref(false)
let initialized = false

function getStoredTheme() {
  if (typeof window === 'undefined') {
    return null
  }

  const value = window.localStorage.getItem(THEME_STORAGE_KEY)
  return value === 'dark' || value === 'light' ? value : null
}

function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme) {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return
  }

  const root = document.documentElement
  const useDark = theme === 'dark'

  root.classList.toggle('dark', useDark)
  root.style.colorScheme = useDark ? 'dark' : 'light'
  window.localStorage.setItem(THEME_STORAGE_KEY, useDark ? 'dark' : 'light')
  isDark.value = useDark
}

export function initializeTheme() {
  if (initialized) {
    return
  }

  applyTheme(getStoredTheme() || getSystemTheme())
  initialized = true
}

export function setTheme(theme) {
  applyTheme(theme)
}

export function useTheme() {
  initializeTheme()

  const theme = computed(() => (isDark.value ? 'dark' : 'light'))

  function toggleTheme() {
    setTheme(isDark.value ? 'light' : 'dark')
  }

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  }
}
