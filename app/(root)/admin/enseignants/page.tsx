import EnseignantTable from "@/components/table/EnseignantTable";

// Génération des données enseignants côté serveur
export default function Page() {
  return <EnseignantTable enseignants={[]} />; // Passer les enseignants au composant client
}
