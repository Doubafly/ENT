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
        {/* <div className=" flex float-end mt-1 justify-between"> */}
        {/* <header className="home-header ml-4"> */}
        {/* <HeaderBox
              type="greeting"
              title="Bienvenue"
              subtext="Technolab ista le meilleure"
              user="Douba"
            /> */}
        {/* </header> */}
        <div className=" absolute  right-0 hidden md:block">
          <UserProfile user={user} />
        </div>
        {/* </div> */}
        <div className="mt-10 md:pl-5 lg:pl-10 xl:pl-44 pl-5 menuPrincipale">
          {children}
        </div>
      </div>
    </main>
  );
}
