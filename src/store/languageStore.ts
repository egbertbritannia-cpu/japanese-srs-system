import { create } from 'zustand'

interface LanguageState {
  appLanguageMode: 'ja' | 'en'
  toggleLanguage: () => void
  setLanguage: (mode: 'ja' | 'en') => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  appLanguageMode: 'ja',
  toggleLanguage: () => set((state) => ({ appLanguageMode: state.appLanguageMode === 'ja' ? 'en' : 'ja' })),
  setLanguage: (mode) => set({ appLanguageMode: mode }),
}))
