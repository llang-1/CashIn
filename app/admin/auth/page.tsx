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
import "dotenv/config";
import { setCookie, getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AdminAuth() {
  return (
    <>
      <NavbarAdmin />
      <FormLoginAdmin />
    </>
  );
}

const FormLoginAdmin = () => {
  const router = useRouter()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const usernameAdmin = process.env.USN_ADM || "pplgBendahara";
  const passwordAdmin = process.env.PW_ADM || "pplgMantap@#";

  const loginHandle = async (e: React.FormEvent) => {
    e.preventDefault();

    

    try {

      if (!username || !password) {
        return addToast({
          title: "Warning",
          description: "Harap isi semua input!",
          color: "warning",
        });
      }

      const response = await axios.post("/api/auth/admin-login", {
        nama: username,
        password: password
      })
      
      if (response.data.code === 'SUCC_LOGIN') {
        setTimeout(() => {
          router.push('/admin')
        })
        return addToast({
          title: 'Berhasil!',
          description: "selamat datang, kamu login sebagai admin.",
          color: "success",
        });
      } else if (response.data.code === 'ERR_LOGIN_404') {
        return addToast({
          title: "Kesalahan!",
          description: "nama atau password tidak sesuai.",
          color: "danger",
        });
      }
    } catch (error) {
      console.error(error)
      return addToast({
          title: "error",
          description: "ada kesalahan server. buka console",
          color: "danger",
        });
    }
  };

  const admCookie = getCookie("key-adm");

  useEffect(() => {
    if (admCookie) {
      redirect("/admin");
    }
  }, []);

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
