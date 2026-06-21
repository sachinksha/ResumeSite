import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ResumeData } from '../types/resume'
import { defaultResumeData } from '../types/resume'
import { parseResumeExcel } from '../utils/excelParser'

export const useResumeStore = defineStore('resume', () => {
  const staticData = ref<ResumeData>({ ...defaultResumeData })
  const uploadedData = ref<ResumeData | null>(null)
  const isLoaded = ref(false)
  const hasUploaded = ref(false)
  const uploadFileName = ref<string | null>(null)
  const lastError = ref<string | null>(null)

  const displayData = computed(() => uploadedData.value ?? staticData.value)

  function loadFromExcel(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const result = parseResumeExcel(e.target!.result as ArrayBuffer)
          uploadedData.value = result
          hasUploaded.value = true
          uploadFileName.value = file.name
          lastError.value = null
          resolve()
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to parse Excel file'
          lastError.value = message
          reject(new Error(message))
        }
      }
      reader.onerror = () => {
        const msg = 'Failed to read file'
        lastError.value = msg
        reject(new Error(msg))
      }
      reader.readAsArrayBuffer(file)
    })
  }

  async function loadFromStaticFile(): Promise<void> {
    try {
      const response = await fetch('/resume-data.xlsx')
      if (!response.ok) {
        throw new Error(`Static resume file not found (${response.status})`)
      }
      const buffer = await response.arrayBuffer()
      const result = parseResumeExcel(buffer)
      staticData.value = result
      isLoaded.value = true
      lastError.value = null
    } catch (err) {
      if (isLoaded.value) return
      staticData.value = { ...defaultResumeData }
      isLoaded.value = false
      lastError.value = err instanceof Error ? err.message : 'Failed to load static resume'
    }
  }

  function setPhoto(photo: string | null): void {
    staticData.value.personalInfo.photo = photo
    if (uploadedData.value) {
      uploadedData.value.personalInfo.photo = photo
    }
  }

  function clearData(): void {
    staticData.value = { ...defaultResumeData }
    uploadedData.value = null
    isLoaded.value = false
    hasUploaded.value = false
    uploadFileName.value = null
    lastError.value = null
  }

  return {
    staticData, uploadedData, isLoaded, hasUploaded,
    uploadFileName, lastError, displayData,
    loadFromExcel, loadFromStaticFile, setPhoto, clearData,
  }
})
