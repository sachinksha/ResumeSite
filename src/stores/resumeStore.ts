import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ResumeData } from '../types/resume'
import { defaultResumeData } from '../types/resume'
import { parseResumeExcel } from '../utils/excelParser'

export const useResumeStore = defineStore('resume', () => {
  const data = ref<ResumeData>({ ...defaultResumeData })
  const isLoaded = ref(false)
  const fileName = ref<string | null>(null)
  const lastError = ref<string | null>(null)

  function loadFromExcel(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const result = parseResumeExcel(e.target!.result as ArrayBuffer)
          data.value = result
          isLoaded.value = true
          fileName.value = file.name
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
      data.value = result
      isLoaded.value = true
      fileName.value = 'resume-data.xlsx'
      lastError.value = null
    } catch (err) {
      if (isLoaded.value) return
      data.value = { ...defaultResumeData }
      isLoaded.value = false
      fileName.value = null
      lastError.value = err instanceof Error ? err.message : 'Failed to load static resume'
    }
  }

  function setPhoto(photo: string | null): void {
    data.value.personalInfo.photo = photo
  }

  function clearData(): void {
    data.value = { ...defaultResumeData }
    isLoaded.value = false
    fileName.value = null
    lastError.value = null
  }

  return { data, isLoaded, fileName, lastError, loadFromExcel, loadFromStaticFile, setPhoto, clearData }
})
