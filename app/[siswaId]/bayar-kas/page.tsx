"use client";

import React, { useState, useEffect, useRef } from "react";
import axios, { Axios, AxiosError } from "axios";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Button, 
  Divider,
  Image,
  Chip,
  addToast
} from "@heroui/react";
import { 
  Wallet2, 
  Banknote, 
  QrCode, 
  Loader2, 
  ChevronLeft, 
  CheckCircle2,
  LogOut,
  Info,
  Copy,
  Clock,
  ShieldCheck
} from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Interface untuk Response Awal (Generate QRIS)
 */
interface TrxResponse {
  code: string;
  message: string;
  qris: string;
  nominal: string;
  trx: Transaction;
}

/**
 * Interface untuk Response Konfirmasi & Polling
 */
interface Transaction {
  id: string;
  nominal: number;
  tanggal_bayar: string;
  nama_siswa: string;
  siswa_id: string;
  createAt: string;
  status: 'pending' | 'waiting' | 'success';
  verifiedAt: string | null;
}

type CekSiswaSession = {
  code: string,
  message: string,
  valueCookies: string
}

export default function PaymentPage() {
  const [nominal, setNominal] = useState<string>("2000");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [qrisUrl, setQrisUrl] = useState<string>("");
  const [status, setStatus] = useState<"pending" | "waiting" | "success" | "error">("pending");
  const [trxData, setTrxData] = useState<Transaction | null>(null);
  const [siswaId, setSiswaId] = useState("")
  const router = useRouter()
  
  // Ref untuk menyimpan interval polling
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Efek untuk Polling Status Transaksi setiap 3 detik
   * Hanya jalan jika status transaksi adalah 'waiting' atau 'pending'
   */
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
   
    // Axios melempar error ke sini jika status code 400
    
  }
}
useEffect(() => {
  if (trxData && (trxData.status === 'pending' || trxData.status === 'waiting')) {
    pollingRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`/api/get-info-trx?trxId=${trxData.id}`);
        
        // PERBAIKAN: Gunakan response.data.getTrx sesuai respon API GET kamu
        const updatedTrx = response.data.getTrx; 

        if (updatedTrx && updatedTrx.status !== trxData.status) {
          setTrxData(updatedTrx);
          
          if (updatedTrx.status === 'success') {
            addToast({
              title: "Pembayaran Diterima!",
              description: "Bendahara telah menyetujui transaksi Anda.",
              color: "success"
            });
            if (pollingRef.current) clearInterval(pollingRef.current);
          }
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 5000); // Saya sarankan 5 detik agar tidak terlalu berat
  }
  cekSessionSiswa()

  return () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
  };
}, [trxData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      title: "Tersalin!",
      description: "ID Transaksi berhasil disalin.",
      color: "primary"
    });
  };

  /**
   * STEP 1: Generate QRIS
   */
  const handleGenerateQRIS = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nominal || isProcessing) return;

    setIsProcessing(true);
    setStatus("waiting");

    try {
      const response = await axios.post<TrxResponse>('/api/bayar-kas', {
        nominal: nominal
      });

      if (response.data.code === 'SUCC_TRX') {
        setQrisUrl(response.data.qris);
        setTrxData(response.data.trx);
        setStatus("success");
        
        addToast({
          title: "QRIS Siap!",
          description: "Silakan scan dan bayar melalui e-wallet.",
          color: "success",
          variant: "flat"
        });
      }
    } catch (err) {
      addToast({
        title: "Gagal",
        description: "Koneksi bermasalah.",
        color: "danger"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  

  /**
   * STEP 2: Konfirmasi Pembayaran (Minta Approve Admin)
   */
const handleKonfirmasi = async () => {
  if (!trxData?.id || isConfirming) return;
  setIsConfirming(true);
  try {
    const response = await axios.post('/api/konfirmasi', { trxId: trxData.id });

    if (response.data.code === 'SUCC_SNDPROOF') {
      // Di sini sudah benar karena API POST mengembalikan trxKonfirmasi
      setTrxData(response.data.trxKonfirmasi); 
      addToast({
          title: "Bukti Terkirim!",
          description: "Harap tunggu verifikasi dari bendahara.",
          color: "warning",
          variant: "solid"
        });
    }
  } catch (err) {
    // handle error
  } finally {
    setIsConfirming(false);
  }
};

  const resetForm = () => {
    setNominal("");
    setQrisUrl("");
    setStatus("pending");
    setTrxData(null);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-[440px] z-10">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">CashIn Pay</h1>
        </div>

        <Card className="bg-zinc-950/40 border border-white/10 backdrop-blur-2xl rounded-[3rem] shadow-2xl">
          <CardHeader className="flex justify-between items-center px-8 pt-8 pb-4">
            <div className="flex items-center gap-4">   
              <div className="text-left">
                <h3 className="text-white font-black text-lg italic tracking-tight uppercase">Bayar Kas</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Siswa Digital</p>
              </div>
            </div>
          </CardHeader>

          <CardBody className="px-8 py-6">
            {status !== "success" ? (
              <form onSubmit={handleGenerateQRIS} className="flex flex-col gap-8">
                <Input
                  isRequired
                  type="number"
                  label="NOMINAL PEMBAYARAN"
                  labelPlacement="outside"
                  placeholder="0"
                  readOnly
                  variant="bordered"
                  value={nominal}
                  onValueChange={setNominal}
                  startContent={<span className="text-zinc-600 font-black text-xl mr-1">Rp</span>}
                  classNames={{
                    input: "text-white text-3xl font-black placeholder:text-zinc-900",
                    label: "text-zinc-500 font-black text-[10px] tracking-[0.3em] mb-4",
                    inputWrapper: "h-20 border-2 border-white/5 group-data-[focus=true]:border-white/30 bg-white/5 rounded-2xl px-6"
                  }}
                />
                
                <Button
                  type="submit"
                  className="h-16 bg-white text-black font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl hover:bg-zinc-200 transition-all"
                  isLoading={isProcessing}
                  endContent={!isProcessing && <QrCode size={20} />}
                >
                  Generate QRIS
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center animate-in zoom-in-95 duration-500">
                {/* QRIS Box */}
                <div className="relative mb-8">
                  <div className="bg-white p-5 rounded-[2.5rem] shadow-2xl">
                    <Image src={qrisUrl} alt="QRIS" width={240} height={240} className="rounded-xl" />
                  </div>
                  <Chip 
                    color={trxData?.status === 'waiting' ? 'warning' : 'primary'} 
                    variant="shadow" 
                    className="absolute -top-2 -right-2 font-black text-[9px] uppercase tracking-[0.2em]"
                  >
                    {trxData?.status === 'waiting' ? 'Waiting Approval' : 'Ready to Scan'}
                  </Chip>
                </div>

                <div className="w-full space-y-6 text-center">
                  <div>
                    <h4 className="text-white font-black text-xl italic uppercase tracking-tighter mb-1">
                      {trxData?.status === 'waiting' ? 'Sedang Diverifikasi' : 'Scan & Bayar'}
                    </h4>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-tight italic">
                      {trxData?.nama_siswa} • Rp {Number(nominal).toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500 font-bold uppercase tracking-widest">Status Transaksi</span>
                      <div className={`flex items-center gap-2 font-black uppercase italic ${
                        trxData?.status === 'success' ? 'text-emerald-500' : 
                        trxData?.status === 'waiting' ? 'text-warning-500' : 'text-blue-500'
                      }`}>
                        {trxData?.status === 'success' ? <CheckCircle2 size={14} /> : <Loader2 size={14} className="animate-spin" />}
                        {trxData?.status}
                      </div>
                    </div>
                    <Divider className="bg-white/5" />
                    <div className="flex justify-between items-center cursor-pointer group" onClick={() => trxData && copyToClipboard(trxData.id)}>
                       <span className="text-zinc-500 font-bold text-[9px] uppercase tracking-widest">Transaction ID</span>
                       <div className="flex items-center gap-2 text-zinc-400 group-hover:text-white transition-colors">
                        <span className="font-mono text-[9px] truncate max-w-[120px]">{trxData?.id}</span>
                        <Copy size={12} />
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {trxData?.status === 'pending' ? (
                      <Button
                        fullWidth
                        className="h-14 bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg"
                        onPress={handleKonfirmasi}
                        isLoading={isConfirming}
                        startContent={!isConfirming && <CheckCircle2 size={18} />}
                      >
                        Konfirmasi Pembayaran
                      </Button>
                    ) : trxData?.status === 'waiting' ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-400">
                        <Clock size={20} className="animate-pulse" />
                        <p className="text-[10px] font-black uppercase text-left leading-tight">
                          Bukti terkirim! Harap tunggu bendahara <br/>menyetujui transaksi ini.
                        </p>
                      </div>
                    ) : null}

                    {trxData?.status === 'success' ? (
                       <Button
                        fullWidth
                        className="h-14 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-2xl"
                        onPress={resetForm}
                        startContent={<ShieldCheck size={18} />}
                      >
                        Selesai & Keluar
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="light"
                        className="h-14 text-zinc-500 font-bold uppercase tracking-widest text-[10px] rounded-2xl"
                        onPress={resetForm}
                        startContent={<ChevronLeft size={16} />}
                      >
                        Batal
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardBody>
          
          <Divider className="bg-white/5" />
          <div className="p-6 text-center">
            <p className="text-zinc-700 text-[9px] font-black uppercase tracking-[0.5em] italic">
              Digital Receipt System
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}