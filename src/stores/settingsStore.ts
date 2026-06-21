import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Settings, Theme, FieldVisibility, FieldDetailModes } from '../types/settings'
import { defaultSettings } from '../types/settings'

const STORAGE_KEY = 'resume-settings'

function loadFromStorage(): Settings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as Settings
    }
  } catch {
  }
  return { ...defaultSettings }
}

function saveToStorage(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const saved = loadFromStorage()
  const theme = ref<Theme>(saved.theme)
  const fieldVisibility = ref<FieldVisibility>({ ...saved.fieldVisibility })
  const fieldDetailModes = ref<FieldDetailModes>({ ...saved.fieldDetailModes })

  function persist(): void {
    saveToStorage({
      theme: theme.value,
      fieldVisibility: fieldVisibility.value,
      fieldDetailModes: fieldDetailModes.value,
    })
  }

  watch([theme, fieldVisibility, fieldDetailModes], persist, { deep: true })

  function toggleTheme(): void {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  function setTheme(t: Theme): void {
    theme.value = t
  }

  function resetSettings(): void {
    theme.value = defaultSettings.theme
    fieldVisibility.value = { ...defaultSettings.fieldVisibility }
    fieldDetailModes.value = { ...defaultSettings.fieldDetailModes }
  }

  return {
    theme,
    fieldVisibility,
    fieldDetailModes,
    toggleTheme,
    setTheme,
    resetSettings,
  }
})
