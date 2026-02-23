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

type WaitingData = {
  id: string,
  nominal: number,
  tanggal_bayar: string,
  nama_siswa: string,
  siswa_id: string,
  createAt: string,
  status: string,
  verifiedAt: string
}

type WaitingResponse = {
  code: string,
  message: string,
  waitingTrx: WaitingData[]
}

export default function VerifikasiUnpaid() {
    return (
        <>
            <NavbarAdmin />
            <CardUnpaidAdmin />
        </>
    )
}

const CardUnpaidAdmin = () => {
  const [students, setStudents] = useState<WaitingData[]>([]);

  const getUnpaid = async () => {
    try {
      const response = await axios.get<WaitingResponse>(
        "/api/show-all",
      );
      return response.data;
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error(e.message);
      }
    }
  };

  const verifikasi = async ({ id, siswa_id }: { id: string, siswa_id: string }) => {
    try {
      const response = await axios.post("/api/verification", {
        trxId: id,
        siswaId: siswa_id
      })
      
      if (response.data.code === 'SUCC_VERIF') {
        return addToast({
          title: 'Berhasil!',
          color: 'success',
          description: 'Kamu berhasil verifikasi pembayaran uang kas!'
        })
      }

    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error(e.message);
      }
    }
  }

  useEffect(() => {
    async function fetch() {
      const data = await getUnpaid();
      if (data) setStudents(data.waitingTrx);
    }

    fetch();
  }, []);

  return (
    <section className="flex flex-col justify-center items-center mt-8">
      <Card className="py-4 w-80 md:w-250">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">List Siswa UnPaid</p>
          <small className="text-default-500">
            list siswa yang belum ter-verifikasi pembayaran nya.
          </small>
        </CardHeader>
        <CardBody className="overflow-visible py-2">
          <Table isStriped aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>ID TRX</TableColumn>
              <TableColumn>NAMA</TableColumn>
              <TableColumn>NOMINAL</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>TANGGAL</TableColumn>
              <TableColumn>AKSI</TableColumn>
            </TableHeader>
            <TableBody emptyContent="tidak ada siswa yang nunggak.">
              {students.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>{item.id.slice(0, 10)}...</TableCell>
                  <TableCell>{item.nama_siswa}</TableCell>
                  <TableCell>{item.nominal}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>{new Date(item.tanggal_bayar).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button color="success" onClick={() => verifikasi({id: String(item.id), siswa_id: item.siswa_id})}>Verifikasi</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </section>
  );
};