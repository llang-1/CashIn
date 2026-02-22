"use client"
import NavbarAdmin from "@/components/navbarAdmin";
import {Card, CardHeader, CardBody, CardFooter, Image} from "@heroui/react";
import { useEffect, useState } from "react";
import axios, {AxiosError} from 'axios';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@heroui/react";


type Saldo = {
  code: number
  message: string
  uangKas: {
    _sum: {
      nominal: number
    }
  }
}

type PaidSiswa = {
  id: string
  nis: string
  nama: string
  password: string
  status_bayar: string
  createAt: string
}

type PaidSiswaResponse = {
  code: string
  message: string
  paidSiswa: PaidSiswa[]
}




type UnpaidSiswa = {
  id: string
  nis: string
  nama: string
  password: string
  status_bayar: string
  createAt: string
}

type UnpaidSiswaResponse = {
  code: string
  message: string
  unpaidSiswa: UnpaidSiswa[]
}

export default function AdminDashboard() {
  return (
    <>
      <NavbarAdmin />
      <CardKasAdmin />
      <CardUnpaidAdmin />
      <CardPaidAdmin />
    </>
  )
}

const CardKasAdmin = () => {

  const [saldo, setSaldo] = useState<Saldo | null>(null)

  const getSaldo = async () => {
    try {
      const response = await axios.get<Saldo>("/api/total-kas")
      return response.data
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error(e.message)
      }
    }
  }

  useEffect(() => {
    async function fetch() {
      const data = await getSaldo()
      if (data) setSaldo(data)
    }

    fetch()

  }, [])

  return (
    <section className="flex flex-col justify-center items-center mt-16">
      <Card className="py-4 w-80 md:w-250">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">Total Uang Kas</p>
        <small className="text-default-500">ini adalah total penjumlahan uangkas yang diterima secara online</small>
        
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <h4 className="font-bold text-large">Rp. {saldo?.uangKas?._sum?.nominal?.toLocaleString() || "0"}</h4>
      </CardBody>
    </Card>
    </section>
  )
}

const CardUnpaidAdmin = () => {
  const [students, setStudents] = useState<UnpaidSiswa[]>([])

    const getUnpaid = async () => {
    try {
      const response = await axios.get<UnpaidSiswaResponse>("/api/get-siswa-unpaid")
      return response.data
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error(e.message)
      }
    }
  }

  useEffect(() => {
    async function fetch() {
      const data = await getUnpaid()
      if (data) setStudents(data.unpaidSiswa)
    }

    fetch()

  }, [])

  return (
    <section className="flex flex-col justify-center items-center mt-8">
      <Card className="py-4 w-80 md:w-250">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">List Siswa UnPaid</p>
        <small className="text-default-500">list siswa yang belum membayar uangkas minggu ini</small>
        
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
  )
}

const CardPaidAdmin = () => {
  const [studentsPaid, setStudentsPaid] = useState<PaidSiswa[]>([])

    const getPaid = async () => {
    try {
      const response = await axios.get<PaidSiswaResponse>("/api/get-siswa-paid")
      return response.data
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        console.error(e.message)
      }
    }
  }

  useEffect(() => {
    async function fetch() {
      const data = await getPaid()
      if (data) setStudentsPaid(data.paidSiswa)
    }

    fetch()

  }, [])

  return (
    <section className="flex flex-col justify-center items-center mt-8">
      <Card className="py-4 w-80 md:w-250">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">List Siswa Paid</p>
        <small className="text-default-500">list siswa yang sudah membayar uangkas minggu ini</small>
        
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
  )
}