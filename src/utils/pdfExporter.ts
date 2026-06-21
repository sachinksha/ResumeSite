import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPdf(element: HTMLElement, filename: string = 'Resume.pdf'): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  })

  const margin = 15
  const pageWidth = 210
  const pageHeight = 297
  const imgWidth = pageWidth - 2 * margin
  const usableHeight = pageHeight - 2 * margin
  const pxPerMm = canvas.width / imgWidth
  const sliceHeightPx = Math.round(usableHeight * pxPerMm)

  const pdf = new jsPDF('p', 'mm', 'a4')
  let offsetPx = 0
  let pageIndex = 0

  while (offsetPx < canvas.height) {
    const currentSliceHeight = Math.min(sliceHeightPx, canvas.height - offsetPx)

    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = canvas.width
    sliceCanvas.height = currentSliceHeight
    const ctx = sliceCanvas.getContext('2d')!
    ctx.drawImage(canvas, 0, offsetPx, canvas.width, currentSliceHeight, 0, 0, canvas.width, currentSliceHeight)

    const sliceData = sliceCanvas.toDataURL('image/png')
    const sliceHeightMm = (currentSliceHeight * imgWidth) / canvas.width

    if (pageIndex > 0) pdf.addPage()
    pdf.addImage(sliceData, 'PNG', margin, margin, imgWidth, sliceHeightMm)

    offsetPx += currentSliceHeight
    pageIndex++
  }

  pdf.save(filename)
}
