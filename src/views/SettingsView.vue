<template>
  <main class="settings-view">
    <h1 class="page-title">Settings</h1>

    <section class="settings-section">
      <h2>Field Visibility</h2>
      <p class="section-desc">Toggle which fields to show or hide on the resume.</p>
      <div class="toggles-grid">
        <label v-for="(visible, field) in settings.fieldVisibility" :key="field" class="toggle-row">
          <span class="toggle-label">{{ formatFieldName(field) }}</span>
          <input
            type="checkbox"
            :checked="visible"
            @change="settings.fieldVisibility[field] = !visible"
          />
        </label>
      </div>
    </section>

    <section class="settings-section">
      <h2>Field Detail Modes</h2>
      <p class="section-desc">Choose how certain fields are displayed.</p>
      <div class="detail-mode-row">
        <span class="toggle-label">Address</span>
        <select v-model="settings.fieldDetailModes.address" class="detail-mode-select">
          <option value="detailed">Detailed</option>
          <option value="summary">Summary</option>
        </select>
      </div>
      <div class="detail-mode-row">
        <span class="toggle-label">Languages</span>
        <select v-model="settings.fieldDetailModes.languages" class="detail-mode-select">
          <option value="detailed">Name + Proficiency</option>
          <option value="summary">Name only</option>
        </select>
      </div>
      <div class="detail-mode-row">
        <span class="toggle-label">Side Projects</span>
        <select v-model="settings.fieldDetailModes.sideProjects" class="detail-mode-select">
          <option value="name-only">Name only</option>
          <option value="name-description">Name + Description</option>
          <option value="full">Name + Description + Link</option>
        </select>
      </div>
      <div class="detail-mode-row">
        <span class="toggle-label">Other Interests</span>
        <select v-model="settings.fieldDetailModes.otherInterests" class="detail-mode-select">
          <option value="summary">Name only</option>
          <option value="detailed">Name + Description</option>
        </select>
      </div>
    </section>

    <section class="settings-section">
      <h2>Theme</h2>
      <div class="theme-control">
        <button
          class="btn"
          :class="{ 'btn-primary': settings.theme === 'light' }"
          @click="settings.setTheme('light')"
        >
          Light
        </button>
        <button
          class="btn"
          :class="{ 'btn-primary': settings.theme === 'dark' }"
          @click="settings.setTheme('dark')"
        >
          Dark
        </button>
      </div>
    </section>

    <section class="settings-section">
      <ImportExportPanel />
    </section>

    <section class="settings-section">
      <h2>Preview</h2>
      <p class="section-desc">Live preview of the resume with current settings applied.</p>
      <ResumeLayout v-if="resumeStore.isLoaded || resumeStore.hasUploaded" :resume="resumeStore.displayData" />
      <div v-else class="empty-preview">
        <p>Upload an Excel file to see the preview.</p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useSettingsStore } from '../stores/settingsStore'
import { useResumeStore } from '../stores/resumeStore'
import ImportExportPanel from '../components/settings/ImportExportPanel.vue'
import ResumeLayout from '../components/resume/ResumeLayout.vue'

const settings = useSettingsStore()
const resumeStore = useResumeStore()

function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim()
}
</script>

<style scoped>
.settings-view {
  max-width: var(--max-width-content);
  margin: 0 auto;
  padding: var(--spacing-lg) var(--spacing-md);
}

.page-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
}

.settings-section {
  margin-bottom: var(--spacing-xl);
}

.settings-section h2 {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.section-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.toggles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: var(--spacing-sm);
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
}

.toggle-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text);
}

.toggle-row input[type='checkbox'] {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
  accent-color: var(--color-primary);
}

.theme-control {
  display: flex;
  gap: var(--spacing-sm);
}

.detail-mode-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 320px;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.detail-mode-select {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.empty-preview {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-muted);
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-lg);
}
</style>
