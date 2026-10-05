import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageState {
  appLanguageMode: 'ja' | 'en'
  toggleLanguage: () => void
  setLanguage: (mode: 'ja' | 'en') => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      appLanguageMode: 'ja',
      toggleLanguage: () => set((state) => ({ appLanguageMode: state.appLanguageMode === 'ja' ? 'en' : 'ja' })),
      setLanguage: (mode) => set({ appLanguageMode: mode }),
    }),
    {
      name: 'language-storage',
    }
  )
)
