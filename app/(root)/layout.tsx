import HeaderBox from "@/components/HeaderBox";
import UserProfile from "@/components/HeaderProfil";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = {
    role: "Etudiant",
    firstName: "Mamadou",
    lastName: "Ba",
    email: "ba6353158@gmail.com",
  };
  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/logo.ico" alt="menu icon" width={30} height={30} />
          <div>
            <MobileNav />
          </div>
        </div>
        <div className=" flex float-end mt-1 justify-between">
          <header className="home-header ml-4">
            {/* <HeaderBox
              type="greeting"
              title="Bienvenue"
              subtext="Technolab ista le meilleure"
              user="Douba"
            /> */}
          </header>
          <div>
            <UserProfile user={user} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
