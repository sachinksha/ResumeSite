import { watchEffect } from 'vue'
import { useSettingsStore } from '../stores/settingsStore'

export function useTheme(): void {
  const settings = useSettingsStore()

  watchEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme)
  })
}
