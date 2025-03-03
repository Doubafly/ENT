"use client";
import HeaderBox from "@/components/HeaderBox";
import UserProfile from "@/components/HeaderProfil";
import { useContext } from "react";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { UserContext } from "@/changerUtilisateur/utilisateur";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const users = useContext(UserContext);
  const user = {
    role: users.userRole,
    firstName: "Mamadou",
    lastName: "Ba",
    email: "ba6353158@gmail.com",
  };
  return (
    <main className="flex h-screen w-full font-inter">
      <div className="fixed h-screen left-0 top-0 ">
        <Sidebar />
      </div>
      <div className="partiecentral">
        <div className="root-layout">
          <Image src="/logo.ico" alt="menu icon" width={30} height={30} />
          <div>
            <MobileNav />
          </div>
        </div>

        <div className=" absolute right-0 top-0 z-10 bg-white ">
          <UserProfile user={user} />
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </main>
  );
}
