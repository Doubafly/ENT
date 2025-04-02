"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AdminLinks, EtudiantLinks, ProfesseurLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";

import { usePathname } from "next/navigation";
const Sidebar = () => {
  const [users, setUser] = useState({
    id: "",
    email: "",
    nom: "",
    prenom: "",
    type: "",
  });

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          console.error("Failed to fetch user session");
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };

    fetchUserSession();
  }, []);
  const links: any[] =
    users.type === "Admin"
      ? AdminLinks
      : users.type === "Enseignant"
      ? ProfesseurLinks
      : users.type === "Etudiant"
      ? EtudiantLinks
      : [];
  const pathname = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-2 h-full mb-3">
        <Link href="/" className="mb-6 cursor-pointer items-center gap-2">
          <Image
            src="/logo.ico"
            alt="logo"
            width={36}
            height={36}
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">TECHNOLAB ISTA </h1>
        </Link>
        <div className="flex flex-col gap-2 flex-grow">
          {links
            .filter(
              (items) =>
                items.title !== "Profil" &&
                items.title !== "parametre" &&
                items.title !== "Déconnexion"
            )
            .map((items) => {
              const isActive =
                pathname === items.path ||
                (pathname &&
                  pathname.startsWith(`${users.type}/${items.path}/`));
              return (
                <Link
                  href={items.path}
                  key={items.title}
                  className={cn("sidebar-link", {
                    "bg-bank-gradient": isActive,
                  })}
                >
                  <div className="relative size-4">
                    <Image
                      src={items.image}
                      alt={items.title}
                      width={24}
                      height={24}
                      className={cn({ "brightness-[3] invert-0": isActive })}
                    ></Image>
                  </div>
                  <p
                    className={cn("sidebar-label", { "!text-white": isActive })}
                  >
                    {items.title}
                  </p>
                </Link>
              );
            })}
        </div>
        <div className="mt-auto">
          {links
            .filter(
              (items) =>
                items.title === "Profil" ||
                items.title === "parametre" ||
                items.title === "Déconnexion"
            )
            .map((items) => {
              const isActive =
                pathname === items.path ||
                (pathname &&
                  pathname.startsWith(`${users.type}/${items.path}/`));
              return (
                <Link
                  href={items.path}
                  key={items.title}
                  className={cn("sidebar-link", {
                    "bg-bank-gradient": isActive,
                  })}
                >
                  <div className="relative size-4">
                    <Image
                      src={items.image}
                      alt={items.title}
                      width={24}
                      height={24}
                      className={cn({ "brightness-[3] invert-0": isActive })}
                    ></Image>
                  </div>
                  <p
                    className={cn("sidebar-label", { "!text-white": isActive })}
                  >
                    {items.title}
                  </p>
                </Link>
              );
            })}
        </div>
      </nav>
    </section>
  );
};

export default Sidebar;
