"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Trash2, 
  Calendar, 
  Tag, 
  AlignLeft, 
  MoreHorizontal,
  ArrowUpRight,
  Loader2,
  AlertCircle
} from "lucide-react";

import { useRouter } from "next/navigation";

interface Expense {
  id: string;
  nama: string;
  nominal: string;
  deskirpsi: string; // Sesuai typo di skema Prisma kamu
  category: string;
  tangga_pengeluaran: string;
}

type CekSiswaSession = {
  code: string,
  message: string,
  valueCookies: string
}

export default function ExpenseTable() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [siswaId, setSiswaId] = useState('')
    const router = useRouter()
  // Fetch data dari API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/daftar-pengeluaran");
      if (response.data.success) {
        setExpenses(response.data.expenses);
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  const cekSessionSiswa = async () => {
  try {
    const response = await axios.get<CekSiswaSession>('/api/auth/get-siswa-login')
    // Jika status 200, biarkan saja atau lakukan sesuatu
    setSiswaId(response.data.valueCookies)
  } catch (err) {

    if (axios.isAxiosError(err)) {
        if (err.response && err.response.status === 400) {
      router.push('/auth/login')
    } else {
      console.error("Terjadi kesalahan lain:", err.message)
    }
    }
   
    
  }
}

  useEffect(() => {
    fetchData();
  }, []);



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Sinkronisasi Data...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-black min-h-screen p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Tabel */}
        <div className="flex items-end justify-between mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Log Pengeluaran</h2>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">Total {expenses.length} Transaksi Terdeteksi</p>
          </div>
          <div className="text-right">
             <span className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.3em]">Status: </span>
             <span className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.3em]">Live Data</span>
          </div>
        </div>

        {expenses.length === 0 ? (
          <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-20 flex flex-col items-center text-center">
            <AlertCircle className="text-zinc-800 mb-4" size={40} />
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Tidak ada data untuk ditampilkan</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {expenses.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-[#0A0A0A] border border-white/5 hover:border-white/20 rounded-3xl p-6 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Info Utama */}
                  <div className="flex items-start gap-5">
                    <div className="mt-1 p-3 bg-white/5 rounded-2xl text-red-500 group-hover:bg-red-500/10 transition-colors">
                      <ArrowUpRight size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-black uppercase italic tracking-tight text-white">{item.nama}</h3>
                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                          {item.category || "Umum"}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-xs font-medium leading-relaxed max-w-md">
                        {item.deskirpsi}
                      </p>
                    </div>
                  </div>

                  {/* Metadata & Nominal */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <Calendar size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {new Date(item.tangga_pengeluaran).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="text-xl font-black italic text-white tracking-tighter">
                      - Rp {Number(item.nominal).toLocaleString()}
                    </div>
                  </div>

                  
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <p className="text-zinc-800 text-[8px] font-black uppercase tracking-[0.6em]">
            Authorized Access Only • CashIn Security
          </p>
        </div>
      </div>
    </div>
  );
}