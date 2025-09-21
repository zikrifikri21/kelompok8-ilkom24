import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { devices, monthlyConsumption, electricityRate } = await request.json()

    const monthlyCost = monthlyConsumption * electricityRate

    // Create device summary for AI analysis
    const deviceSummary = devices
      .map(
        (device: any) =>
          `${device.name}: ${device.power}W, ${device.dailyUsage}h/hari, ${device.quantity} unit, ${device.monthlyKwh.toFixed(2)} kWh/bulan`,
      )
      .join("\n")

    const prompt = `
Analisis konsumsi listrik rumah tangga berikut:

PERANGKAT:
${deviceSummary}

TOTAL KONSUMSI: ${monthlyConsumption.toFixed(2)} kWh/bulan
ESTIMASI BIAYA: Rp ${monthlyCost.toLocaleString("id-ID")}/bulan

Berikan analisis dalam format JSON dengan struktur berikut:
{
  "energySavingTips": [
    "tip hemat energi 1",
    "tip hemat energi 2",
    "tip hemat energi 3",
    "tip hemat energi 4",
    "tip hemat energi 5"
  ],
  "environmentalTips": [
    "tip ramah lingkungan 1",
    "tip ramah lingkungan 2",
    "tip ramah lingkungan 3",
    "tip ramah lingkungan 4",
    "tip ramah lingkungan 5"
  ]
}

Tips harus spesifik, praktis, dan relevan dengan perangkat yang digunakan. Fokus pada:
- Pengaturan suhu AC yang optimal
- Penggunaan lampu LED
- Mematikan perangkat standby
- Waktu penggunaan yang efisien
- Alternatif energi terbarukan
- Dampak lingkungan dan cara menguranginya

PENTING: Berikan hanya JSON murni tanpa markdown formatting, tanpa backticks, tanpa penjelasan tambahan.
`

    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    })

    let text = response.text.trim()

    if (text.startsWith("```json")) {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        text = jsonMatch[1].trim()
      }
    } else if (text.startsWith("```")) {
      const jsonMatch = text.match(/```\s*([\s\S]*?)\s*```/)
      if (jsonMatch) {
        text = jsonMatch[1].trim()
      }
    }

    let analysis
    try {
      analysis = JSON.parse(text)
    } catch (parseError) {
      console.error("JSON parsing failed, raw response:", text)
      analysis = {
        energySavingTips: [
          "Gunakan lampu LED untuk menghemat energi hingga 80%",
          "Atur suhu AC pada 24-26°C untuk efisiensi optimal",
          "Matikan perangkat elektronik saat tidak digunakan",
          "Gunakan timer untuk perangkat yang sering lupa dimatikan",
          "Pertimbangkan penggunaan panel surya untuk energi terbarukan",
        ],
        environmentalTips: [
          "Kurangi penggunaan AC dengan ventilasi alami",
          "Pilih perangkat dengan label Energy Star",
          "Gunakan air dingin untuk mencuci pakaian",
          "Manfaatkan cahaya alami di siang hari",
          "Lakukan audit energi rumah secara berkala",
        ],
      }
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error generating AI analysis:", error)
    return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 })
  }
}
