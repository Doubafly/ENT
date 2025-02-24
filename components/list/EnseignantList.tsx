"use client";

import { useState } from "react";
import ListCard, { User } from "@/components/card/ListCard";

const enseignantsData: User[] = [
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "mah@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  },
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "kissa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  },
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "awa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  },
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "dramane@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  },
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "moussa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  },
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "issa@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  },
  {
    image: "/img/dd.jpeg",
    nom: "Dupont",
    prenom: "Jean",
    email: "bourma@example.com",
    adresse: "Paris, France",
    date: "01/01/1980",
    tel: "0123456789",
  },
];

export default function EnseignantList() {
  const [enseignants, setEnseignants] = useState(enseignantsData);

  const handleEdit = (user: User) => {
    console.log("Modifier :", user);
  };

  const handleDelete = (user: User) => {
    setEnseignants(enseignants.filter((e) => e !== user));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {enseignants.map((enseignant) => (
        <ListCard
          key={enseignant.email}
          item={enseignant}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
