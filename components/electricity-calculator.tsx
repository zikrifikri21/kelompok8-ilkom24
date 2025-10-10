"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, Calculator, Zap, DollarSign } from "lucide-react"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"

interface Device {
  id: string
  name: string
  power: number
  dailyUsage: number
  quantity: number
}

interface CalculationResult {
  dailyConsumption: number
  monthlyConsumption: number
  devices: (Device & { dailyKwh: number; monthlyKwh: number })[]
}

interface AIAnalysis {
  monthlyCost: number
  energySavingTips: string[]
  environmentalTips: string[]
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function ElectricityCalculator() {
  const [devices, setDevices] = useState<Device[]>([{ id: "1", name: "", power: 0, dailyUsage: 0, quantity: 1 }])
  const [result, setResult] = useState<CalculationResult | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [electricityRate, setElectricityRate] = useState(1500) // PLN rate per kWh in IDR

  const addDevice = () => {
    const newDevice: Device = {
      id: Date.now().toString(),
      name: "",
      power: 0,
      dailyUsage: 0,
      quantity: 1,
    }
    setDevices([...devices, newDevice])
  }

  const removeDevice = (id: string) => {
    if (devices.length > 1) {
      setDevices(devices.filter((device) => device.id !== id))
    }
  }

  const updateDevice = (id: string, field: keyof Device, value: string | number) => {
    setDevices(devices.map((device) => (device.id === id ? { ...device, [field]: value } : device)))
  }

  const calculateConsumption = () => {
    setIsCalculating(true)

    // Calculate consumption for each device
    const calculatedDevices = devices
      .filter((device) => device.name && device.power > 0)
      .map((device) => {
        const dailyKwh = (device.power * device.dailyUsage * device.quantity) / 1000
        const monthlyKwh = dailyKwh * 30
        return { ...device, dailyKwh, monthlyKwh }
      })

    const totalDaily = calculatedDevices.reduce((sum, device) => sum + device.dailyKwh, 0)
    const totalMonthly = calculatedDevices.reduce((sum, device) => sum + device.monthlyKwh, 0)

    const calculationResult: CalculationResult = {
      dailyConsumption: totalDaily,
      monthlyConsumption: totalMonthly,
      devices: calculatedDevices,
    }

    setResult(calculationResult)
    setIsCalculating(false)
  }

  const getAIAnalysis = async () => {
    if (!result) return

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/electricity-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          devices: result.devices,
          monthlyConsumption: result.monthlyConsumption,
          electricityRate,
        }),
      })

      if (response.ok) {
        const analysis = await response.json()
        setAiAnalysis(analysis)
      }
    } catch (error) {
      console.error("Error getting AI analysis:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const chartData =
    result?.devices.map((device, index) => ({
      name: device.name,
      value: device.monthlyKwh,
      color: COLORS[index % COLORS.length],
    })) || []

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Kalkulator Penggunaan Listrik Rumah
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Electricity Rate Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rate">Tarif Listrik (IDR per kWh)</Label>
              <Input id="rate" type="number" min={100} value={electricityRate} onChange={(e) => setElectricityRate(Math.max(100, Number(e.target.value)))} placeholder="1500" />
            </div>
          </div>

          {/* Device Inputs */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Perangkat Elektronik</h3>
            {devices.map((device, index) => (
              <div key={device.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div>
                  <Label htmlFor={`name-${device.id}`}>Nama Perangkat</Label>
                  <Input id={`name-${device.id}`} value={device.name} onChange={(e) => updateDevice(device.id, "name", e.target.value)} placeholder="Contoh: TV LED" />
                </div>
                <div>
                  <Label htmlFor={`power-${device.id}`}>Daya (Watt)</Label>
                  <Input
                    id={`power-${device.id}`}
                    type="number"
                    value={device.power || 0}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value < 0) {
                        return;
                      }
                      updateDevice(device.id, "power", value);
                    }}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor={`usage-${device.id}`}>Penggunaan Harian (Jam)</Label>
                  <Input
                    id={`usage-${device.id}`}
                    type="number"
                    step="0.5"
                    value={device.dailyUsage || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value < 0) {
                        return;
                      }
                      updateDevice(device.id, "dailyUsage", value);
                    }}
                    placeholder="8"
                  />
                </div>
                <div>
                  <Label htmlFor={`quantity-${device.id}`}>Jumlah</Label>
                  <Input
                    id={`quantity-${device.id}`}
                    type="number"
                    value={device.quantity || ""}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value < 1) {
                        return;
                      }
                      updateDevice(device.id, "quantity", value);
                    }}
                    placeholder="1"
                  />
                </div>
                <div className="flex items-end">
                  <Button variant="outline" size="sm" onClick={() => removeDevice(device.id)} disabled={devices.length === 1}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" onClick={addDevice} className="w-full bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Perangkat
            </Button>
          </div>

          <Button onClick={calculateConsumption} disabled={isCalculating} className="w-full">
            {isCalculating ? "Menghitung..." : "Hitung Konsumsi Listrik"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Summary Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Hasil Perhitungan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{result.dailyConsumption.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">kWh/hari</div>
                  </div>
                  <div className="p-4 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{result.monthlyConsumption.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">kWh/bulan</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Detail per Perangkat:</h4>
                  {result.devices.map((device) => (
                    <div key={device.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span className="font-medium">{device.name}</span>
                      <span className="text-sm text-muted-foreground">{device.monthlyKwh.toFixed(2)} kWh/bulan</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Estimasi Biaya Bulanan:</span>
                    <span className="text-lg font-bold text-primary">Rp {(result.monthlyConsumption * electricityRate).toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <Button onClick={getAIAnalysis} disabled={isAnalyzing} className="w-full">
                  {isAnalyzing ? "Menganalisis..." : "Dapatkan Analisis AI"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <Card className="border-none shadow-lg rounded-2xl bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">⚡ Visualisasi Konsumsi</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 space-y-8">
              {/* Pie Chart */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Distribusi Konsumsi per Perangkat</h4>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value: number) => [`${value.toFixed(2)} kWh`, "Konsumsi"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>

              {/* Bar Chart */}
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Konsumsi Bulanan per Perangkat</h4>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                      <YAxis tick={{ fill: "#6b7280" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value: number) => [`${value.toFixed(2)} kWh`, "Konsumsi"]}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-bar-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Analysis */}
      {aiAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Analisis AI & Rekomendasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-primary">💡 Tips Hemat Energi</h4>
                <ul className="space-y-2">
                  {aiAnalysis.energySavingTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 text-primary">🌱 Tips Ramah Lingkungan</h4>
                <ul className="space-y-2">
                  {aiAnalysis.environmentalTips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
