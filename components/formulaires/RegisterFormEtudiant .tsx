"use client";
// j'ai ransformer mon formulaire en composant pour pouvoir l'utiliser dans plusieurs pages
import { useState } from "react";
import { registerUser } from "@/actions/signupetudiant";
type RegisterFormProps = {
  onSubmit: (formData: FormData) => Promise<void>; //  LA fonction qui est  appelée lors de la soumission
  title?: string; // Titre du formulaire a voir en bas
};

const RegisterFormEtudiant = ({ onSubmit, title = "Créer un étudiant" }: RegisterFormProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null); 
    setSuccess(null);

    const formData = new FormData(event.currentTarget);

    try {
    await registerUser(formData); 
      setSuccess("Étudiant créé avec succès !");
    } catch (err) {
      setError("Erreur lors de la création de l'étudiant.");
    }
  }

  return (
    <div>
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <h1 className="text-xl font-bold">{title}</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <div className="flex flex-col gap-1 mt-6 "> 
      <div className="flex gap-4 w-full flex-nowrap overflow-x-auto">


      <div>
        <label className="block text-gray-700 mb-2">Nom :</label>
        <input type="text" name="nom"  className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Prénom :</label>
        <input type="text" name="prenom"  className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Email :</label>
        <input type="email" name="email"  className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
      </div>
      </div>
      <div className="flex gap-4 mt-4">

      <div>
        <label className="block text-gray-700 mb-2">Mot de passe :</label>
        <input type="password" name="mot_de_passe"  className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Sexe :</label>
        <select name="sexe" className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
          <option value="M">Maxculin</option>
          <option value="F">Feminin</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Téléphone :</label>
        <input type="text" name="telephone"  className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      </div>
      <div className="flex gap-4 mt-4">

      <div>
        <label className="block text-gray-700 mb-2">Adresse :</label>
        <input type="text" name="adresse"  className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Profil :</label>
        <input type="text" name="profil"  className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
      </div>

      <div>
        <label className="block text-gray-700 mb-2">Date de naissance :</label>
        <input type="date" name="date_naissance"  className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required />
      </div>
      </div>

      <div className="flex gap-4 mt-4">
      <div>
        <label className="block text-gray-700 mb-2">Role :</label>
        <select name="id_role" className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
          <option value="1">Membre</option>
          <option value="2">Syndycat</option>
          <option value="3">autre</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Filière :</label>
        <select name="id_filiere" className="w-[260px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
          <option value="1">AP</option>
          <option value="2">IG</option>
          <option value="3">TEC</option>
        </select>
      </div>
      </div>

      </div>
      <div className="flex gap-4 mt-4"> 
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Créer
      </button>
      </div>
    </form>
    </div>
  );
};

export default RegisterFormEtudiant;
// "use client";
// import { useState, useCallback } from "react";

// type RegisterFormProps = {
//   onSubmit: (formData: FormData) => Promise<void>; // Fonction de soumission personnalisable
//   title?: string;
// };

// const RegisterFormEtudiant = ({ onSubmit, title = "Créer un étudiant" }: RegisterFormProps) => {
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();
//     setError(null);
//     setSuccess(null);
//     setLoading(true);

//     const formData = new FormData(event.currentTarget);

//     try {
//       await onSubmit(formData);
//       setSuccess("Étudiant créé avec succès !");
//     } catch (err) {
//       setError("Erreur lors de la création de l'étudiant.");
//     } finally {
//       setLoading(false);
//     }
//   }, [onSubmit]);

//   return (
//     <div>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <h1 className="text-xl font-bold">{title}</h1>
//         {error && <p className="text-red-500">{error}</p>}
//         {success && <p className="text-green-500">{success}</p>}

//         <div className="flex flex-col gap-1 mt-6">
//           <div className="flex gap-4 mt-4">
//             <div>
//               <label className="block text-gray-700 mb-2">Nom :</label>
//               <input type="text" name="nom" className="input-field" required />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Prénom :</label>
//               <input type="text" name="prenom" className="input-field" required />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Email :</label>
//               <input type="email" name="email" className="input-field" required />
//             </div>
//           </div>

//           <div className="flex gap-4 mt-4">
//             <div>
//               <label className="block text-gray-700 mb-2">Mot de passe :</label>
//               <input type="password" name="mot_de_passe" className="input-field" required />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Sexe :</label>
//               <select name="sexe" className="input-field" required>
//                 <option value="M">Masculin</option>
//                 <option value="F">Féminin</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Téléphone :</label>
//               <input type="text" name="telephone" className="input-field" />
//             </div>
//           </div>

//           <div className="flex gap-4 mt-4">
//             <div>
//               <label className="block text-gray-700 mb-2">Adresse :</label>
//               <input type="text" name="adresse" className="input-field" />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Profil :</label>
//               <input type="text" name="profil" className="input-field" required />
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Date de naissance :</label>
//               <input type="date" name="date_naissance" className="input-field" required />
//             </div>
//           </div>

//           <div className="flex gap-4 mt-4">
//             <div>
//               <label className="block text-gray-700 mb-2">Role :</label>
//               <select name="id_role" className="input-field" required>
//                 <option value="1">Membre</option>
//                 <option value="2">Syndicat</option>
//                 <option value="3">Autre</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Filière :</label>
//               <select name="id_filiere" className="input-field" required>
//                 <option value="1">AP</option>
//                 <option value="2">IG</option>
//                 <option value="3">TEC</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-4 mt-4">
//           <button
//             type="submit"
//             className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//             disabled={loading}
//           >
//             {loading ? "En cours..." : "Créer"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default RegisterFormEtudiant;
