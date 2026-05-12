"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Menu, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Bell, 
  ArrowUpRight,
  X,
  User,
  Settings,
  LogOut,
  CreditCard,
  PieChart,
  Loader2
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import { useRouter } from "next/navigation"; // Gunakan useRouter
import { addToast } from '@heroui/react';

// Definisi Interface untuk data Siswa
interface Siswa {
  id: string;
  nis: string;
  nama: string;
  status_bayar: 'paid' | 'unpaid';
  createAt: string;
}

// Interface untuk respon saldo
type Saldo = {
  totalMasuk: number,
  totalKeluar: number,
  saldo: number,
  jumlahPengeluaran: number,
};

type CekSiswaSession = {
  code: string,
  message: string,
  valueCookies: string
}

const App: React.FC = () => {
  const [siswa, setSiswa] = useState<Siswa | null>(null);
  const [saldo, setSaldo] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const params = useParams();
  const [siswaId, setSiswaId] = useState('')
  const router = useRouter();

  // Helper untuk format rupiah
  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number);
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

  // Fungsi Fetch Data Siswa
  const fetchSiswaData = async (id: string): Promise<void> => {
    try {
      const response = await axios.get<{ code: string; message: string; siswa: Siswa }>(`/api/get-info-siswa/${id}`); 
      if (response.data.code === "SUCC") {
        setSiswa(response.data.siswa);
      }
    } catch (error) {
      console.error("Gagal mengambil data siswa:", error);
    }
  };

  const logoutHandle = async () => {
    try {
      const response = await axios.post('/api/auth/logout-siswa')
      if (response.data.code === 'SUCC_DEL') {
        setTimeout(() => {
        router.push('/auth/login')
      }, 1000)
        return addToast({
          title: 'Berhasil logout',
          color: 'success'
        })
      }

      

    } catch (error) {
      console.error(error)
    }
  }

  // Fungsi Ambil Saldo (Uang Kas Global)
  const getSaldo = async () => {
    try {
      const response = await axios.get<Saldo>('/api/catet-pengeluaran');
        const total = response.data.saldo || 0;
        setSaldo(total);
    } catch (error) {
      console.error("Gagal mengambil saldo:", error);
    }
  };

  useEffect(() => {
    const initData = async () => {
      let idFromUrl = "";
      if (typeof window !== "undefined") {
        const pathParts = window.location.pathname.split('/');
        idFromUrl = pathParts[pathParts.length - 1];
      }

      if (!idFromUrl) {
        setLoading(false);
        return;
      }

      setLoading(true);

      await Promise.all([fetchSiswaData(idFromUrl), getSaldo()]);
      setLoading(false);
    cekSessionSiswa()

    };

    initData();
  }, []); // Dependency array kosong karena kita hanya ingin menjalankan ini saat mount

  const toggleDrawer = (): void => setIsDrawerOpen(!isDrawerOpen);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <Loader2 className="text-white animate-spin" size={40} />
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Memuat Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center p-4 selection:bg-white selection:text-black">
      
      {/* Drawer Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isDrawerOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleDrawer}
      />

      {/* Drawer Menu */}
      <div className={`fixed top-0 right-0 h-full w-[280px] bg-[#0A0A0A] border-l border-white/10 z-[70] transition-transform duration-500 ease-out p-8 flex flex-col ${
        isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex justify-between items-center mb-12">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Akun Siswa</span>
          <button onClick={toggleDrawer} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Nama Siswa</p>
            <p className="font-black text-sm uppercase italic tracking-tighter truncate">
              {siswa?.nama || "Guest"}
            </p>
            <p className="text-[9px] text-white/20 mt-1">{siswa?.nis || "N/A"}</p>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: <PieChart size={20} />, label: 'Pengeluaran Kas', url: `/${siswaId}/lihat-pengeluaran` },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => router.push(item.url)}
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white hover:text-black transition-all group"
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <button onClick={() => logoutHandle() } className="flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-colors mt-auto">
          <LogOut size={20} />
          <span className="text-[11px] font-bold uppercase tracking-widest">Keluar</span>
        </button>
      </div>

      {/* Main Dashboard Container */}
      <div className="w-full max-w-md bg-[#0A0A0A] rounded-[2.5rem] overflow-hidden flex flex-col min-h-[750px] relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black tracking-tighter uppercase">CashIn</span>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleDrawer} className="p-2 hover:bg-white/5 rounded-full transition-all">
              <Menu size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8 overflow-y-auto">
          
          {/* Section Saldo Dinamis */}
          <div className="space-y-3">
            <h2 className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Total Kas Global</h2>
            <div className="bg-white rounded-[2rem] p-8 text-black group relative overflow-hidden transition-transform active:scale-[0.98]">
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-black uppercase opacity-40 tracking-widest">Dana Terkumpul</span>
                  <div className="text-4xl font-black tracking-tighter mt-1">
                    {formatRupiah(saldo)}
                  </div>
                </div>
                <div className="p-2 bg-black/5 rounded-full">
                  <ArrowUpRight size={18} className="opacity-40" />
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-black/5 rounded-full" />
            </div>
          </div>

          {/* Section Status Pembayaran */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-widest ml-1">Status Pembayaran</h3>

            {siswa?.status_bayar === "paid" ? (
              <div className="bg-black border-2 border-white rounded-[2rem] p-8 flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-500">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center rotate-3">
                  <CheckCircle2 size={32} className="text-black" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black uppercase italic tracking-tighter">Terverifikasi</h4>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                    Halo {siswa?.nama.split(' ')[0]}, Kamu sudah lunas!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-[#151515] border border-white/10 rounded-[2rem] p-6 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/5">
                    <AlertCircle size={22} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black uppercase italic tracking-tight text-white/90">Belum Bayar</h4>
                    <p className="text-white/40 text-[10px] font-bold uppercase tracking-tighter mt-1">
                      Minggu ini kamu belum bayar!
                    </p>
                  </div>
                </div>

                <button 
                  className="w-full bg-white hover:bg-zinc-200 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.97] uppercase tracking-[0.2em] text-xs"
                  onClick={() => router.push(`/${siswaId}/bayar-kas`)}
                >
                  Bayar Sekarang
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Statistik NIS */}
          <div className="flex justify-center items-center p-2">
            <div className="bg-[#151515] p-5 rounded-[2rem] border border-white/5 transition-transform hover:scale-105">
              <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1 text-center">NIS</div>
              <div className="font-black text-center text-[11px] uppercase tracking-tighter truncate opacity-60">
                {siswa?.nis || "---"}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default App;