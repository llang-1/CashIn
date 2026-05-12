"use client";
import NavbarAdmin from "@/components/navbarAdmin";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Progress,
  Button,
  NumberInput,
  addToast
} from "@heroui/react";
import { ReactHTMLElement, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { number } from "framer-motion";
import { redirect, useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";

type Saldo = {
  totalMasuk: number,
  totalKeluar: number,
  saldo: number,
  jumlahPengeluaran: number,
};

type PendingSiswa = {
  id: string,
  nominal: number,
  tanggal_bayar: string,
  nama_siswa: string,
  siswa_id: string,
  createAt: string,
  status: string,
  verifiedAt: string | number | null
}

type PendingSiswaResponse = {
  code: string,
  message: string,
  pendingPayment: PendingSiswa[]
}

type PaidSiswa = {
  id: string;
  nis: string;
  nama: string;
  password: string;
  status_bayar: string;
  createAt: string;
};

type PaidSiswaResponse = {
  code: string;
  message: string;
  paidSiswa: PaidSiswa[];
};

type UnpaidSiswa = {
  id: string;
  nis: string;
  nama: string;
  password: string;
  status_bayar: string;
  createAt: string;
};

type UnpaidSiswaResponse = {
  code: string;
  message: string;
  unpaidSiswa: UnpaidSiswa[];
};

export default function AdminDashboard() {
  const router = useRouter();
  const admCookie = getCookie("admin-login");

const cekSessionAdmin = async () => {
  try {
    const response = await axios.get('/api/cek-admin');
  
    console.log("Session aman");
    
  } catch (error) {
    console.log("Kena tendang!");
    router.push('/admin/auth');
  }
}

  useEffect(() => {
    cekSessionAdmin()
  }, []);

  return (
    <>
      <NavbarAdmin />
      <CardKasAdmin />
      <CardUnpaidAdmin />
      <CardPaidAdmin />
      <CardPending />
    </>
  );
}

const CardKasAdmin = () => {
  const [saldo, setSaldo] = useState<Saldo | null>(null);
  const [target, setTarget] = useState<number>();
  const router = useRouter();

  // const [totalTarget, setTotalTarget] = useState<number>(() => {
  //   const stored = localStorage.getItem("targetKas");
  //   return stored ? Number(stored) : 0;
  // });

  const getSaldo = async () => {
    try {
      const response = await axios.get<Saldo>("/api/catet-pengeluaran");
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error(e.message);
      }
    }
  };

  // const handleChangeTargetKas = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!target) {
  //     alert("set target dulu!");
  //     return;
  //   }

  //   localStorage.setItem("targetKas", String(target));
  //   setTotalTarget(target);
  // };

  useEffect(() => {
    async function fetch() {
      const data = await getSaldo();
      if (data) setSaldo(data);
    }

    fetch();
  }, []);

  // const saldoKas = saldo?.uangKas._sum.nominal ?? 0;
  // const persen = totalTarget > 0 ? Math.min((saldoKas / totalTarget) * 100, 100) : 0;

  return (
    <section className="flex flex-col justify-center items-center mt-16">
      <Card className="py-4 w-80 md:w-250">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Total Uang Kas</p>
          <small className="text-default-500">
            ini adalah total penjumlahan uangkas yang diterima secara online
          </small>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <h1 className="text-4xl font-extrabold tracking-tight mt-2">
            Rp{" "}
            {saldo
              ? saldo.saldo.toLocaleString("id-ID") || "0"
              : "loading..."}
          </h1>

          <div className="mt-6">
            {/* <NumberInput
                className="max-w-xs mb-4"
                value={target}
                onValueChange={setTarget}
                placeholder="masukkan target kas"
              /> */}
            <div className="gap-2 flex">
              <Button
                color="primary"
                onClick={() => router.refresh()}
                type="submit"
              >
                Reload
              </Button>
              {/* <Button color="danger" type="reset" variant="flat">
                  Reset input
                </Button> */}
            </div>
          </div>
        </CardBody>
      </Card>
    </section>
  );
};

const CardUnpaidAdmin = () => {
  const [students, setStudents] = useState<UnpaidSiswa[]>([]);

  const getUnpaid = async () => {
    try {
      const response = await axios.get<UnpaidSiswaResponse>(
        "/api/get-siswa-unpaid",
      );
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error(e.message);
      }
    }
  };

  useEffect(() => {
    async function fetch() {
      const data = await getUnpaid();
      if (data) setStudents(data.unpaidSiswa);
    }

    fetch();
  }, []);

  return (
    <section className="flex flex-col justify-center items-center mt-8">
      <Card className="py-4 w-80 md:w-250">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">List Siswa UnPaid</p>
          <small className="text-default-500">
            list siswa yang belum membayar uangkas minggu ini
          </small>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Table isStriped aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>NIS</TableColumn>
              <TableColumn>NAMA</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="tidak ada siswa yang nunggak.">
              {students.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.id.slice(0, 10)}...</TableCell>
                  <TableCell>{item.nis}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.status_bayar}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </section>
  );
};

const CardPaidAdmin = () => {
  const [studentsPaid, setStudentsPaid] = useState<PaidSiswa[]>([]);

  const getPaid = async () => {
    try {
      const response = await axios.get<PaidSiswaResponse>(
        "/api/get-siswa-paid",
      );
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error(e.message);
      }
    }
  };

  useEffect(() => {
    async function fetch() {
      const data = await getPaid();
      if (data) setStudentsPaid(data.paidSiswa);
    }

    fetch();
  }, []);

  return (
    <section className="flex flex-col justify-center items-center mt-8">
      <Card className="py-4 w-80 md:w-250">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">List Siswa Paid</p>
          <small className="text-default-500">
            list siswa yang sudah membayar uangkas minggu ini
          </small>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Table isStriped aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>NIS</TableColumn>
              <TableColumn>NAMA</TableColumn>
              <TableColumn>STATUS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="tidak ada siswa yang membayar.">
              {studentsPaid.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.id.slice(0, 10)}...</TableCell>
                  <TableCell>{item.nis}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.status_bayar}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </section>
  );
};

const CardPending = () => {
  const [studentsPending, setStudentsPending] = useState<PendingSiswa[]>([]);

  const getPending = async () => {
    try {
      const response = await axios.get<PendingSiswaResponse>(
        "/api/get-pending",
      );
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error(e.message);
      }
    }
  };

  useEffect(() => {
    async function fetch() {
      const data = await getPending();
      if (data) setStudentsPending(data.pendingPayment);
    }

    fetch();
  }, []);

  return (
    <section className="flex flex-col justify-center items-center mt-8">
      <Card className="py-4 w-80 md:w-250">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">List Siswa Pending</p>
          <small className="text-default-500">
            list siswa yang sudah bayar namun belum di konfirmasi
          </small>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Table isStriped aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>ID TRX</TableColumn>
              <TableColumn>NAMA</TableColumn>
              <TableColumn>NOMINAL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>TANGGAL BAYAR</TableColumn>
            </TableHeader>
            <TableBody emptyContent="tidak ada pembayaran pending.">
              {studentsPending.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.id.slice(0, 10)}...</TableCell>
                  <TableCell>{item.nama_siswa}</TableCell>
                  <TableCell>{item.nominal}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{new Date(item.tanggal_bayar).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </section>
  );
};
