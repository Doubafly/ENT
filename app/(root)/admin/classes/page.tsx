"use client";
import dynamic from "next/dynamic";

const ClasseList = dynamic(() => import("@/components/table/ListeClasse"), {
  loading: () => <div>Chargement...</div>,
  ssr: false, // optionnel, utile si le composant ne supporte pas le SSR
});

const ClassePage = () => {
  return (
    <div>
      <ClasseList />
    </div>
  );
};

export default ClassePage;
