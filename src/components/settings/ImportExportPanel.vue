<template>
  <div class="import-export-panel">
    <h3 class="panel-title">Import / Export</h3>

    <div class="action-group">
      <h4>Photo</h4>
      <p class="description">Upload a photo or paste a URL to display on the resume.</p>

      <div v-if="resumeStore.displayData.personalInfo.photo" class="photo-preview">
        <img :src="resumeStore.displayData.personalInfo.photo" alt="Resume photo" class="photo-img" />
        <button class="btn btn-sm" @click="clearPhoto">Remove</button>
      </div>

      <label class="input-label">Upload image (JPG, PNG)</label>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp"
        class="file-input"
        @change="handlePhotoUpload"
      />

      <label class="input-label">Or paste a photo URL</label>
      <div class="url-row">
        <input
          type="url"
          class="text-input"
          placeholder="https://example.com/photo.jpg"
          :value="photoUrl"
          @input="handleUrlInput"
        />
      </div>
    </div>

    <div class="action-group">
      <h4>Download Template</h4>
      <p class="description">Download a blank Excel template to fill in your resume data.</p>
      <button class="btn btn-primary" @click="downloadTemplate">
        Download Template
      </button>
    </div>

    <div class="action-group">
      <h4>Upload Excel File</h4>
      <p class="description">Upload a filled Excel file in the template format.</p>
      <input
        type="file"
        accept=".xlsx,.xls"
        class="file-input"
        @change="handleFileUpload"
      />
      <p v-if="resumeStore.uploadFileName" class="file-name">Loaded: {{ resumeStore.uploadFileName }}</p>
    </div>

    <div class="action-group">
      <h4>Export Full PDF</h4>
      <p class="description">Download the complete resume as a PDF (all fields, no filters).</p>
      <button class="btn btn-primary" :disabled="isExporting || !(resumeStore.isLoaded || resumeStore.hasUploaded)" @click="exportFullPdf">
        {{ isExporting ? 'Exporting...' : 'Export PDF' }}
      </button>
    </div>

    <div class="action-group">
      <h4>Export Filtered PDF</h4>
      <p class="description">Download the resume PDF with current visibility settings applied.</p>
      <button class="btn btn-primary" :disabled="isExporting || !(resumeStore.isLoaded || resumeStore.hasUploaded)" @click="exportFilteredPdf">
        {{ isExporting ? 'Exporting...' : 'Export Filtered PDF' }}
      </button>
    </div>

    <p v-if="exportError" class="error">{{ exportError }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useResumeStore } from '../../stores/resumeStore'
import { exportTemplate } from '../../utils/excelExporter'
import { usePdfExport } from '../../composables/usePdfExport'

const resumeStore = useResumeStore()
const { isExporting, exportError, exportPdf } = usePdfExport()
const photoUrl = ref('')

function downloadTemplate(): void {
  exportTemplate()
}

async function handleFileUpload(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    try {
      await resumeStore.loadFromExcel(file)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to load file')
    }
  }
}

function handlePhotoUpload(event: Event): void {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    resumeStore.setPhoto(reader.result as string)
    photoUrl.value = ''
  }
  reader.onerror = () => alert('Failed to read image file')
  reader.readAsDataURL(file)
}

function handleUrlInput(event: Event): void {
  const value = (event.target as HTMLInputElement).value
  photoUrl.value = value
  if (value) {
    resumeStore.setPhoto(value)
  }
}

function clearPhoto(): void {
  resumeStore.setPhoto(null)
  photoUrl.value = ''
}

async function exportFullPdf(): Promise<void> {
  await exportPdf('resume-content', 'Resume-Full.pdf')
}

async function exportFilteredPdf(): Promise<void> {
  await exportPdf('resume-content', 'Resume-Filtered.pdf')
}
</script>

<style scoped>
.import-export-panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.panel-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.action-group {
  padding: var(--spacing-md);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.action-group h4 {
  font-size: var(--font-size-base);
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-text);
}

.description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.input-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-top: var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
}

.file-input {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.file-name {
  font-size: var(--font-size-sm);
  color: var(--color-success);
  font-weight: 500;
}

.photo-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.photo-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
}

.url-row {
  display: flex;
  gap: var(--spacing-sm);
}

.text-input {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  background-color: var(--color-bg);
  color: var(--color-text);
}

.text-input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: -1px;
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  border-radius: var(--radius-sm);
}

.error {
  font-size: var(--font-size-sm);
  color: white;
  padding: var(--spacing-sm);
  background-color: var(--color-error);
  border-radius: var(--radius-sm);
}
</style>
