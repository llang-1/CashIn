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
  addToast
} from "@heroui/react";
import { useEffect, useState } from "react";
import "dotenv/config"
import { setCookie, getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import axios from "axios";

export default function Auth() {
  return (
    <>
      <NavbarAdmin />
      <FormLogin />
    </>
  );
}

const FormLogin = () => {
  const [nis, setNis] = useState("")
  const [password, setPassword] = useState("")
  const idSiswa = getCookie("x-id-siswa")


  const loginHandle = async (e: React.FormEvent) => {
      e.preventDefault()

      try {
            if (!nis || !password) {
                return addToast({
                title: 'Warning',
                description: 'Harap isi semua input!',
                color: 'warning'
                })
            }  

            const response = await axios.post('/api/auth/login-siswa', {
                nis: nis,
                password: password
            })

            if (response.status === 201) {
                return addToast({
                title: 'Berhasil login!',
                description: 'Kamu berhasil login sebagai admin!',
                color: 'success',
                promise: new Promise((resolve) => setTimeout(redirect(`/${idSiswa?.valueOf()}`), 3000))
            })
            }


      } catch (error) {
        return addToast({
                title: 'error',
                description: 'ada kesalahan harap coba lagi!',
                color: 'danger'
                })
      }

    //   if (nis === usernameAdmin && password === passwordAdmin) {
    //     setCookie("key-adm", "293hydxe892222i8w9e", {
    //       path: '/',
    //     })

        
  }


  useEffect(() => {
    if (idSiswa) {
    redirect(`/${idSiswa.valueOf()}`)
  }
  }, [])

  return (
    <section className="flex justify-center items-center p-2 mt-8">
      <Card className="w-70 md:w-100">
        <CardHeader>
          <h1 className="font-bold text-center">Login Siswa</h1>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={loginHandle}>
            <Input
              isRequired
              label="Username"
              placeholder="masukkan username"
              type="text"
              value={nis}
              onValueChange={setNis}
            />
            <Input
              isRequired    
              label="Password"
              placeholder="masukkan password"
              type="password"
              value={password}
              onValueChange={setPassword}
            />
            <div className="flex gap-2 justify-end">
              <Button type="submit" fullWidth color="primary">
                Login
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </section>
  );
};
