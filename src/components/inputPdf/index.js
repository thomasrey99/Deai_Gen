'use client'

import { useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export default function LectorPDF() {
  const [error, setError] = useState(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const typedArray = new Uint8Array(reader.result)
        const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise

        let fullText = ''
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const content = await page.getTextContent()
          const text = content.items.map(item => item.str).join(' ')
          console.log(`Página ${i}:\n`, text)
          fullText += text + '\n'
        }

        console.log('Texto completo del PDF:\n', fullText)
      } catch (err) {
        console.error(err)
        setError('Error al procesar el PDF.')
      }
    }

    reader.readAsArrayBuffer(file)
  }

  return (
    <div className="p-4">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
