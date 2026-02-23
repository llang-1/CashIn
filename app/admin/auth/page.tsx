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

export default function AdminAuth() {
  return (
    <>
      <NavbarAdmin />
      <FormLoginAdmin />
    </>
  );
}

const FormLoginAdmin = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const usernameAdmin = process.env.USN_ADM || "pplgBendahara"
  const passwordAdmin = process.env.PW_ADM || "pplgMantap@#"

  const loginHandle = (e: React.FormEvent) => {
      e.preventDefault()

      if (!username || !password) {
        return addToast({
                title: 'Warning',
                description: 'Harap isi semua input!',
                color: 'warning'
            })
      }

      if (username !== usernameAdmin || password !== passwordAdmin) {
        return addToast({
                title: 'Warning',
                description: 'Username atau password salah!',
                color: 'warning'
            })
      }

      if (username === usernameAdmin && password === passwordAdmin) {
        setCookie("key-adm", "293hydxe892222i8w9e", {
          path: '/',
        })

        return addToast({
                title: 'Berhasil login!',
                description: 'Kamu berhasil login sebagai admin!',
                color: 'success',
                promise: new Promise((resolve) => setTimeout(redirect('/admin'), 3000))
            })
      }
  }

  const admCookie = getCookie("key-adm")

  useEffect(() => {
    if (admCookie) {
    redirect('/admin')
  }
  }, [])

  return (
    <section className="flex justify-center items-center p-2 mt-8">
      <Card className="w-70 md:w-100">
        <CardHeader>
          <h1 className="font-bold text-center">Login Admin</h1>
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-4" onSubmit={loginHandle}>
            <Input
              isRequired
              label="Username"
              placeholder="masukkan username admin"
              type="text"
              value={username}
              onValueChange={setUsername}
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
