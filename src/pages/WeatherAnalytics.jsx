import { useState, useEffect } from "react";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { fetchWeatherCorrelation } from "../services/api";

function WeatherAnalytics() {
  const [data, setData] = useState({ tren: [], matriks: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeatherCorrelation()
      .then(setData)
      .catch(err => console.error("Gagal memuat analitik cuaca:", err))
      .finally(() => setLoading(false));
  }, []);

  // Helper warna dinamis untuk Heatmap (mirip cmap='Reds' di Seaborn)
  const getHeatmapColor = (value) => {
    if (value === 0) return "rgba(241, 245, 249, 1)"; // slate-100 untuk 0
    if (value < 0) return `rgba(59, 130, 246, ${Math.min(Math.abs(value) + 0.1, 1)})`; // Biru untuk korelasi negatif
    return `rgba(239, 68, 68, ${Math.min(value + 0.1, 1)})`; // Merah untuk korelasi positif
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-slate-400 animate-pulse">Memuat Analitik Cuaca...</div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analitik Cuaca & Performa ISP</h1>
        <p className="text-sm text-slate-500 mt-1">Korelasi kondisi cuaca terhadap lonjakan tiket gangguan jaringan</p>
      </div>

      {/* 1. Grafik Tren (Dual-Axis) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-800">Tren Harian: Kecepatan Angin vs Tiket Maintenance</h2>
          <p className="text-xs text-slate-400">Distribusi kejadian selama periode operasional</p>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
  <ComposedChart data={data.tren} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
    <XAxis 
      dataKey="tanggal" 
      tick={{ fontSize: 12, fill: "#64748b" }} 
      axisLine={false} 
      tickLine={false} 
      dy={10}
    />
    <YAxis 
      yAxisId="left" 
      tick={{ fontSize: 12, fill: "#64748b" }} 
      axisLine={false} 
      tickLine={false} 
      dx={-10}
    />
    <YAxis 
      yAxisId="right" 
      orientation="right" 
      tick={{ fontSize: 12, fill: "#64748b" }} 
      axisLine={false} 
      tickLine={false} 
      dx={10}
    />
    <Tooltip 
      contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }} 
    />
    <Legend verticalAlign="top" height={36} iconType="circle" />

    {/* Garis Cuaca (Skala Kiri) */}
    <Line yAxisId="left" type="monotone" dataKey="angin" name="Angin" stroke="#3b82f6" strokeWidth={2} dot={false} />
    <Line yAxisId="left" type="monotone" dataKey="hujan" name="Hujan" stroke="#0ea5e9" strokeWidth={2} dot={false} />

    {/* Garis Operasional (Skala Kanan) */}
    <Line yAxisId="right" type="monotone" dataKey="mtTotal" name="Total MT" stroke="#ef4444" strokeWidth={2} dot={false} />
    <Line yAxisId="right" type="monotone" dataKey="mtKabel" name="Kabel Putus" stroke="#f59e0b" strokeWidth={2} dot={false} />
    <Line yAxisId="right" type="monotone" dataKey="mtMatot" name="Matot" stroke="#8b5cf6" strokeWidth={2} dot={false} />
    <Line yAxisId="right" type="monotone" dataKey="psb" name="PSB" stroke="#22c55e" strokeWidth={2} dot={false} />
    <Line yAxisId="right" type="monotone" dataKey="dismantle" name="Dismantle" stroke="#64748b" strokeWidth={2} dot={false} />
  </ComposedChart>
</ResponsiveContainer>
        </div>
      </div>

      {/* 2. Heatmap Korelasi Pearson */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden lg:w-2/3">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Heatmap Korelasi Pearson</h2>
          <p className="text-xs text-slate-400">Skala -1.0 hingga 1.0 (Semakin merah = korelasi positif kuat)</p>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-left font-medium text-slate-500 border border-slate-200 bg-slate-50">Metrik ISP \ Cuaca</th>
                {data.matriks?.cuacaCols.map(col => (
                  <th key={col} className="p-3 text-center font-medium text-slate-600 border border-slate-200 bg-slate-50 w-36">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.matriks?.ispRows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-700 border border-slate-200">{row.nama}</td>
                  {row.korelasi.map((val, idx) => (
                    <td key={idx} 
                        className="p-3 text-center font-semibold border border-slate-200 transition-colors"
                        style={{ backgroundColor: getHeatmapColor(val), color: Math.abs(val) > 0.4 ? 'white' : '#334155' }}>
                      {val.toFixed(2)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default WeatherAnalytics;