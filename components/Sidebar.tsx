"use client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AdminLinks, EtudiantLinks, ProfesseurLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
interface UserProfileProps {
  user: {
    prenom: string;
    nom: string;
    type: string;
    profil?: string;
  };
}
import { usePathname } from "next/navigation";
const Sidebar = ({ user }: UserProfileProps) => {
  const links: any[] =
    user.type === "Admin"
      ? AdminLinks
      : user.type === "Enseignant"
      ? ProfesseurLinks
      : user.type === "Etudiant"
      ? EtudiantLinks
      : [];
  const pathname = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-2 h-full mb-3">
        <Link href="/" className="mb-6 cursor-pointer items-center gap-2">
          <Image
            src="/img/logoS.png"
            alt="logo"
            width={50}
            height={50}
            className="size-[30px] max-xl:size-20"
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
                  pathname.startsWith(`${user.type}/${items.path}/`));
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
                  pathname.startsWith(`${user.type}/${items.path}/`));
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
