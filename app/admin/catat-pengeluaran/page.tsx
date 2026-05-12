"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  ArrowLeft, 
  ChevronRight, 
  Utensils, 
  Truck, 
  Camera, 
  FileText,
  Loader2,
  CheckCircle2,
  Plus,
  Tag,
  AlignLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ExpenseForm() {
  const [step, setStep] = useState(1); 
  const [nama, setNama] = useState("");
  const [nominal, setNominal] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [category, setCategory] = useState("Logistik");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter()
  // State untuk saldo real-time dari API
  const [currentSaldo, setCurrentSaldo] = useState<number>(0);
  const [isLoadingSaldo, setIsLoadingSaldo] = useState(true);

  // Ambil saldo saat komponen di-load
  const cekSessionAdmin = async () => {
  try {
    const response = await axios.get('/api/cek-admin');
  
    console.log("Session aman");
    
  } catch (error) {
    console.log("Kena tendang!");
    router.push('/admin/auth');
  }
}
  const fetchSaldo = async () => {
    try {
      const res = await axios.get("/api/pengeluaran");
      setCurrentSaldo(res.data.saldo);
    } catch (err) {
      console.error("Gagal ambil saldo");
    } finally {
      setIsLoadingSaldo(false);
    }
  };


  const categories = [
    { name: "Konsumsi", icon: Utensils, color: "text-orange-400" },
    { name: "Logistik", icon: Truck, color: "text-blue-400" },
    { name: "Alat Tulis", icon: FileText, color: "text-emerald-400" },
    { name: "Lainnya", icon: Plus, color: "text-purple-400" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Panggil API yang baru kita buat
      await axios.post("/api/catet-pengeluaran", {
        nama,
        nominal,
        deskripsi,
        category
      });
      
      setStep(2);
    } catch (err) {
      alert("Gagal menyimpan data ke database");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    cekSessionAdmin()
  })

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col items-center p-6">
      
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-xl z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Nav */}
        <div className="flex items-center justify-between mb-10">
          <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
            <div className="p-2 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
          </button>
          
        </div>

        {step === 1 ? (
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5">
              <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-1">Catat Pengeluaran</h1>
              <p className="text-zinc-500 text-xs font-medium">Input data pengeluaran kas secara teliti.</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Nama Pengeluaran</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-white transition-colors">
                    <Tag size={20} />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder="Contoh: Snack Rapat"
                    className="w-full h-16 bg-white/5 border border-white/5 focus:border-white/20 rounded-2xl pl-14 pr-6 text-lg font-bold focus:outline-none transition-all placeholder:text-zinc-800"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Nominal (IDR)</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700 font-bold text-2xl group-focus-within:text-white transition-colors">Rp</span>
                  <input
                    required
                    type="number"
                    placeholder="0"
                    className="w-full h-24 bg-white/5 border-2 border-white/5 focus:border-white/20 rounded-[2rem] pl-16 pr-8 text-4xl font-black focus:outline-none transition-all placeholder:text-zinc-900 tracking-tighter"
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Kategori</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setCategory(cat.name)}
                      className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                        category === cat.name 
                        ? 'bg-white border-white text-black' 
                        : 'bg-white/5 border-white/5 text-zinc-400 hover:border-white/20'
                      }`}
                    >
                      <cat.icon size={18} className={category === cat.name ? 'text-black' : cat.color} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-1">Deskripsi / Keterangan</label>
                <div className="relative group">
                  <div className="absolute left-5 top-5 text-zinc-700 group-focus-within:text-white transition-colors">
                    <AlignLeft size={20} />
                  </div>
                  <textarea
                    required
                    placeholder="Jelaskan detail pengeluaran di sini..."
                    className="w-full bg-white/5 border border-white/5 focus:border-white/20 rounded-2xl pl-14 pr-6 py-5 text-sm text-white placeholder:text-zinc-800 focus:outline-none min-h-[120px] transition-all resize-none"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !nominal || !nama || !deskripsi}
                className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl hover:bg-zinc-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <>Catat Pengeluaran <ChevronRight size={18} /></>}
              </button>

            </form>
          </div>
        ) : (
          <div className="bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-12 text-center flex flex-col items-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mb-8">
              <CheckCircle2 size={48} className="animate-bounce" />
            </div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Berhasil Dicatat</h2>
            <p className="text-zinc-500 text-sm mb-10">
              Pengeluaran <span className="text-white font-bold">{nama}</span> sebesar <span className="text-white font-bold">Rp {Number(nominal).toLocaleString()}</span> telah disimpan. Saldo otomatis terpotong.
            </p>
            
            <div className="w-full grid grid-cols-2 gap-4">
              <button 
                onClick={() => {
                  setStep(1);
                  setNama("");
                  setNominal("");
                  setDeskripsi("");
                }}
                className="h-14 bg-white/5 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Buat Lagi
              </button>
              <button 
                onClick={() =>  router.push('/admin')}
                className="h-14 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all"
              >
                Kembali
              </button>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-zinc-800 text-[9px] font-black uppercase tracking-[0.5em] italic">
          Audit Trail System • CashIn v2.4
        </p>
      </div>
    </div>
  );
}