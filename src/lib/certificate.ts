import jsPDF from 'jspdf'

export interface CertificateData {
  userName: string
  userEmail: string
  totalScore: number
  completionDate: string
  breakdown: Array<{
    pillarName: string
    obtained: number
    maxPoints: number
    weight: number
    weightedScore: number
  }>
}

export function generateCertificate(data: CertificateData): void {
  const doc = new jsPDF('landscape', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  // Fondo con gradiente simulado
  doc.setFillColor(16, 185, 129) // emerald-500
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  // Marco decorativo
  doc.setDrawColor(255, 255, 255)
  doc.setLineWidth(3)
  doc.rect(15, 15, pageWidth - 30, pageHeight - 30)

  // Marco interior
  doc.setLineWidth(1)
  doc.rect(25, 25, pageWidth - 50, pageHeight - 50)

  // Titulo principal
  doc.setFontSize(32)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('CERTIFICADO DE SOSTENIBILIDAD', pageWidth / 2, 60, { align: 'center' })

  // Subtitulo
  doc.setFontSize(18)
  doc.setFont('helvetica', 'normal')
  doc.text('Green Fashion Score', pageWidth / 2, 80, { align: 'center' })

  // Contenido principal
  doc.setFontSize(16)
  doc.text('Se certifica que', pageWidth / 2, 110, { align: 'center' })

  // Nombre del usuario
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text(data.userName, pageWidth / 2, 130, { align: 'center' })

  // Email
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(data.userEmail, pageWidth / 2, 145, { align: 'center' })

  // Puntuacion
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(`Puntuacion Total: ${data.totalScore.toFixed(1)}%`, pageWidth / 2, 170, { align: 'center' })

  // Fecha de completado
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text(`Completado el: ${data.completionDate}`, pageWidth / 2, 185, { align: 'center' })

  // Desglose por pilares
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Desglose por Pilares:', 40, 210)

  let yPosition = 225
  data.breakdown.forEach((pillar, index) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage()
      yPosition = 30
    }

    const achievedRatio = pillar.maxPoints === 0 ? 0 : Math.min(1, pillar.obtained / pillar.maxPoints)
    const weightedRatio = pillar.weight === 0 ? 0 : pillar.weightedScore / pillar.weight
    const normalizedWeighted = Math.max(0, Math.min(1, weightedRatio))

    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`${pillar.pillarName}:`, 40, yPosition)
    
    doc.setFont('helvetica', 'normal')
    doc.text(`${pillar.obtained.toFixed(1)}/${pillar.maxPoints} puntos`, 120, yPosition)
    doc.text(`Peso: ${(pillar.weight * 100).toFixed(1)}%`, 180, yPosition)
    doc.text(`Puntuacion: ${(normalizedWeighted * 100).toFixed(1)}%`, 240, yPosition)

    yPosition += 15
  })

  // Pie de pagina
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.text('Este certificado es valido y puede ser verificado en el sistema Green Fashion Score', pageWidth / 2, pageHeight - 20, { align: 'center' })

  // Descargar el PDF
  const fileName = `Certificado_Sostenibilidad_${data.userName.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`
  doc.save(fileName)
}

export function copyResultsToClipboard(data: CertificateData): void {
  const text = `🏆 Certificado de Sostenibilidad Green Fashion Score

👤 Usuario: ${data.userName}
📧 Email: ${data.userEmail}
📊 Puntuacion Total: ${data.totalScore.toFixed(1)}%
📅 Completado: ${data.completionDate}

📈 Desglose por Pilares:
${data.breakdown.map(pillar => {
  const achievedRatio = pillar.maxPoints === 0 ? 0 : Math.min(1, pillar.obtained / pillar.maxPoints)
  const weightedRatio = pillar.weight === 0 ? 0 : pillar.weightedScore / pillar.weight
  const normalizedWeighted = Math.max(0, Math.min(1, weightedRatio))
  return `• ${pillar.pillarName}: ${pillar.obtained.toFixed(1)}/${pillar.maxPoints} puntos (${(normalizedWeighted * 100).toFixed(1)}%)`
}).join('\n')}

🌱 ¡Comprometido con la moda sostenible!`

  navigator.clipboard.writeText(text).then(() => {
    alert('Resultados copiados al portapapeles')
  }).catch(() => {
    alert('Error al copiar al portapapeles')
  })
}
