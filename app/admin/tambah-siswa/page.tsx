"use client";
import NavbarAdmin from "@/components/navbarAdmin";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Link,
  Button,
  addToast,
} from "@heroui/react";
import { useEffect, useState } from "react";
import "dotenv/config"
import { setCookie, getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import axios, {AxiosError} from "axios";

export default function AdminAuth() {
  return (
    <>
      <NavbarAdmin />
      <TambahSiswaForm />
    </>
  );
}

function TambahSiswaForm() {
  const [nis, setNis] = useState("")
  const [nama, setNama] = useState("")
  const [password, setPassword] = useState("")


  const addHandle = async (e: React.FormEvent) => {
      e.preventDefault()
    
        if (!nis || !nama || !password) {
            addToast({
                title: 'Warning',
                description: 'Harap isi semua input!',
                color: 'warning'
            })
        }

        try {
            const response = await axios.post("/api/auth/register-siswa", {
                nis: nis,
                nama: nama,
                password: password
            })

            if (response.data.code === 'SUCC_REG') {
                addToast({
                    title: 'Berhasil',
                    description: 'Kamu berhasil membuat siswa baru!',
                    color: 'success'
                })
            }
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.error(error.message)
            }
        }

  }

  const admCookie = getCookie("key-adm")

  useEffect(() => {
    if (!admCookie) {
    redirect('/admin/auth')
  }
  }, [])

  return (
    <section className="flex justify-center items-center p-2 mt-8">
      <Card className="w-70 md:w-100">
        <CardHeader>
          <h1 className="font-bold text-center">Tambah Siswa</h1>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={addHandle}>
            <Input
              isRequired
              label="NIS"
              placeholder="masukkan nis siswa"
              type="text"
              value={nis}
              onValueChange={setNis}
            />
            <Input
              isRequired
              label="Nama lengkap"
              placeholder="masukkan nama lengkap siswa"
              type="text"
              value={nama}
              onValueChange={setNama}
            />
            <Input
              isRequired
              label="Password"
              placeholder="masukkan password untuk siswa"
              type="password"
              value={password}
              onValueChange={setPassword}
            />
            <div className="flex gap-2 justify-end">
              <Button type="submit" fullWidth color="primary">
                Buat siswa
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
