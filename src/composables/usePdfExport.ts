import { ref } from 'vue'
import { exportToPdf } from '../utils/pdfExporter'

export function usePdfExport() {
  const isExporting = ref(false)
  const exportError = ref<string | null>(null)

  async function exportPdf(elementId: string, filename: string = 'Resume.pdf'): Promise<void> {
    isExporting.value = true
    exportError.value = null
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error('Resume element not found')
      }
      await exportToPdf(element, filename)
    } catch (err) {
      exportError.value = err instanceof Error ? err.message : 'Failed to export PDF'
    } finally {
      isExporting.value = false
    }
  }

  return { isExporting, exportError, exportPdf }
}
