"use client";
import RightSidebar from "@/components/RightSidebar";
import Statistique from "@/components/statistique/statistique";

export default function Home() {
  const user = {
    role: "Admin",
    firstName: "Mamadou",
    lastName: "Ba",
    email: "ba6353158@gmail.com",
  };
  const StatData = [
    {
      link: "/icons/text-books.png",
      value: "2",
      nom: "Nombre Filiere",
    },
    {
      link: "/icons/friends.png",
      value: "2",
      nom: "Nombre etudiant",
    },
    {
      link: "/icons/teach.png",
      value: "2",
      nom: "Nombre classe",
    },
    {
      link: "/icons/Training.png",
      value: "2",
      nom: "Nombre enseignant",
    },
  ];
  return (
    <section className="home">
      <div className="home-content">
        <Statistique menuStat={StatData} />
      </div>
      <RightSidebar />
    </section>
  );
}
