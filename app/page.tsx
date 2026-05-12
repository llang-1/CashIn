"use client"
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Menu, 
  X, 
  PieChart, 
  History,
  Code
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type CekSiswaSession = {
  code: string,
  message: string,
  valueCookies: string
}

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter()



  useEffect(() => {
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black">
      {/* Navigasi Sederhana */}
      <nav className="fixed w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Code size={18} className="text-white" /> */}
            <span className="font-bold tracking-tight text-lg text-white">CASHIN.</span>
            <span className="hidden sm:block text-[10px] text-gray-500 font-medium ml-2 border-l border-white/10 pl-2">X PPLG</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#fitur" className="text-xs font-medium text-gray-400 hover:text-white transition-colors">Fitur</a>
            <button className="px-5 py-2 bg-white text-black text-xs font-bold rounded-md hover:bg-gray-200 transition-all">
              Masuk
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-b border-white/5 p-6 space-y-4">
            <a href="#fitur" className="block text-sm text-gray-400">Fitur</a>
            <button className="w-full py-3 bg-white text-black text-sm font-bold rounded-md">Masuk</button>
          </div>
        )}
      </nav>

      {/* Hero Section Simple */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Aplikasi Kas Kelas X PPLG</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Kelola Kas Kelas <br/>
            <span className="text-gray-500 text-3xl md:text-5xl">Tanpa Ribet.</span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl mb-10 leading-relaxed">
            Sistem pencatatan kas transparan untuk siswa X PPLG SMK Mahaputra Cerdas Utama. Pantau saldo dalam satu pintu.
          </p>
          <div className="flex gap-4">
            <button onClick={() => router.push('/auth/login')} className="px-8 py-3 bg-white text-black rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-all">
              Masuk Sebagai X PPLG <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Fitur Sederhana */}
      <section id="fitur" className="py-24 px-6 border-t border-white/5 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
              <PieChart size={20} />
            </div>
            <h3 className="text-xl font-bold">Transparansi Saldo</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Semua siswa bisa melihat total saldo kelas secara langsung tanpa harus menunggu pengumuman dari bendahara.
            </p>
          </div>

          <div className="space-y-4">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
              <History size={20} />
            </div>
            <h3 className="text-xl font-bold">Riwayat Jelas</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Setiap iuran yang masuk atau pengeluaran untuk kelas tercatat dengan detail tanggal dan keterangannya.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Minimalis */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight">CASHIN.</span>
            <span className="text-[10px] text-gray-600 uppercase tracking-widest">X PPLG</span>
          </div>
          <p className="text-[10px] text-gray-600 font-medium uppercase tracking-widest">
            &copy; 2026 Gilang Wardhani X-PPLG
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;