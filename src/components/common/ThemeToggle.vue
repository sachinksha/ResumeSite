<template>
  <button
    class="theme-toggle"
    :aria-label="`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} theme`"
    @click="settings.toggleTheme()"
  >
    <span v-if="settings.theme === 'light'" aria-hidden="true">&#9790;</span>
    <span v-else aria-hidden="true">&#9728;</span>
  </button>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../../stores/settingsStore'

const settings = useSettingsStore()
</script>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-bg-card);
  color: var(--color-text);
  font-size: 1.125rem;
  transition: background-color 0.15s;
}

.theme-toggle:hover {
  background: var(--color-bg-secondary);
}
</style>
