import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function NavbarAdmin() {
  const menuItems = [
    {nama: "Tambah siswa", url: '/admin/tambah-siswa'},
    {nama: "Verifikasi pembayaran", url: '/admin/verifikasi-trx'},
    {nama: "Catat pengeluaran", url: '/admin/catat-pengeluaran'},
    {nama: "Lihat pengeluaran", url: '/admin/lihat-pengeluaran'},
  ]

  return (
    <Navbar isBordered>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="start">
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <p className="font-bold text-inherit">CashIn Admin</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="start">
        <NavbarBrand>
          {/* <AcmeLogo /> */}
          <p className="font-bold text-inherit">CashIn Admin</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/admin/tambah-siswa">
            Tambah Siswa
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link color="foreground" href="/admin/verifikasi-trx">
            Verifikasi Pembayaran
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/admin">
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/admin/catat-pengeluaran">
            Catat Pengeluaran
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/admin/lihat-pengeluaran">
            Lihat pengeluaran
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
            <Button as={Link} color="primary" href="/admin" variant="flat">
            Beranda   
          </Button>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color="foreground"
              href={item.url}
              size="lg"
            >
              {item.nama}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
