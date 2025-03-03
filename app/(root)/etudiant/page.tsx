"use client";
import EmploieStudent from "@/components/EmploieStudent";
import RightSidebar from "@/components/RightSidebar";
import Statistique from "@/components/statistique/statistique";
import TableauD from "@/components/table/TableauMatiere";

export default function Home() {
  const user = {
    role: "Etudiant",
    firstName: "Mamadou",
    lastName: "Ba",
    email: "ba6353158@gmail.com",
  };
  const StatData = [
    {
      link: "/icons/text-books.png",
      value: "2",
      nom: "Nombre Module",
    },
    {
      link: "/icons/friends.png",
      value: "2",
      nom: "Nombre Abscence",
    },
    {
      link: "/icons/teach.png",
      value: "2",
      nom: "Nombre Module Valider",
    },
    {
      link: "/icons/Training.png",
      value: "2",
      nom: "Nombre Session",
    },
  ];
  return (
    <>
      {/* <h1 className="text-3xl">Acceuil</h1> */}
      <section className="home flex">
        <div className="home-content">
          {/* <Statistique menuStat={StatData} /> */}
          {/* <TableauD></TableauD> */}
          <EmploieStudent />
        </div>
        <RightSidebar />
      </section>
    </>
  );
}
