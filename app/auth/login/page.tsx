"use client";

import React, { useEffect, useState } from "react";
// Karena sistem pratinjau memiliki kendala dengan library eksternal tertentu, 
// saya menggunakan komponen berbasis Tailwind murni namun dengan struktur 
// yang kompatibel agar Anda bisa langsung menggantinya kembali ke HeroUI di lokal.
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  LockKeyhole, 
  UserCircle2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2,
  Wallet2 
} from "lucide-react";


type CekSiswaSession = {
  code: string,
  message: string,
  valueCookies: string
}
export default function Auth() {
  return (
    <main className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ornamen Latar Belakang */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <FormLogin />
    </main>
  );
}

const FormLogin = () => {
  const router = useRouter();
  const [nis, setNis] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [siswaId, setSiswaId] = useState("")

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Fungsi pengecekan sesi
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
    cekSessionSiswa();
  }, []);

  const loginHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      if (!nis || !password) {
        setErrorMessage("Harap isi semua input!");
        setIsSubmitting(false);
        return;
      }

      const response = await axios.post("/api/auth/login-siswa", {
        nis,
        password,
      });

      if (response.status === 201 || response.status === 200) {
        // Berhasil login
        const sessionRes = await axios.get('/api/auth/get-siswa-login');
        if (sessionRes.data.valueCookies) {
          router.push(`/${sessionRes.data.valueCookies}`);
        } else {
          window.location.reload();
        }
      }
    } catch (error) {
      setErrorMessage("NIS atau Password tidak sesuai");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] z-10 animate-in fade-in zoom-in duration-700">
      {/* Header Logo */}
      <div className="flex flex-col items-center mb-8 gap-3">
        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">CashIn</h1>
      </div>

      {/* Kartu Utama */}
      <div className="bg-zinc-900/40 border border-white/10 backdrop-blur-2xl shadow-2xl rounded-[3rem] p-4">
        <div className="flex flex-col gap-1 pb-0 pt-8 px-8">
          <h2 className="text-2xl font-bold text-white tracking-tight">Selamat Datang</h2>
          <p className="text-zinc-400 text-sm">Masuk untuk membayar uangkas X-PPLG.</p>
        </div>
        
        <div className="py-10 px-8">
          <form className="flex flex-col gap-6" onSubmit={loginHandle}>
            <div className="flex flex-col gap-2">
              <label className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest ml-1">Nomor Induk Siswa</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors">
                  <UserCircle2 size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Masukkan NIS"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40 transition-all"
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest ml-1">Kata Sandi</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors">
                  <LockKeyhole size={20} />
                </div>
                <input
                  type={isVisible ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/40 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={toggleVisibility} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                >
                  {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] py-3 px-4 rounded-xl text-center">
                {errorMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="h-16 bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-zinc-200 transition-all active:scale-[0.97] shadow-xl shadow-white/5 mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Masuk Sekarang <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="h-px bg-white/5 mx-8" />
        
      </div>

      <p className="mt-10 text-center text-zinc-600 text-[9px] font-black uppercase tracking-[0.6em]">
        © {new Date().getFullYear()} Gilang Wardhani X-PPLG
      </p>
    </div>
  );
};