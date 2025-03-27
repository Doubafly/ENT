"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function Page() {
  const route = useRouter();

  const handleSub = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    const payload = {
      email: data.email,
      password: data.mot_de_passe,
    };

    console.log("Payload envoyé :", payload);

    const login = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (login.ok) {
      alert("Connexion réussie");
      route.push("./");
    } else {
      alert("Erreur de connexion");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex w-full max-w-4xl">
        {/* 🟢 Section Gauche : Formulaire */}
        <div className="w-1/2 p-6 flex flex-col justify-center"> {/* Réduit le padding (p-8 à p-6) */}
          {/* Logo */}
          <div className="flex justify-center mb-2"> {/* Réduit la marge en bas (mb-4 à mb-2) */}
            <Image
              src="/img/logoS.png" // Chemin vers votre logo
              alt="Logo"
              width={250} // Réduit légèrement la taille du logo
              height={150} // Réduit légèrement la taille du logo
              className="object-contain" // Pour s'assurer que l'image s'adapte correctement
            />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Connexion</h1> {/* Garde la marge en bas */}

          <form onSubmit={handleSub}>
            {/* Champ Email */}
            <div className="mb-2 relative"> {/* Réduit la marge en bas (mb-3 à mb-2) */}
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Champ Mot de passe */}
            <div className="mb-2 relative"> {/* Réduit la marge en bas (mb-3 à mb-2) */}
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                name="mot_de_passe"
                placeholder="Mot de passe"
                className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Lien Mot de passe oublié */}
            <a href="#" className="text-blue-500 text-sm block text-right mb-2"> {/* Réduit la marge en bas (mb-3 à mb-2) */}
              Mot de passe oublié ?
            </a>

            {/* Bouton Connexion */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-purple-400 transition"
            >
              Se connecter
            </button>
          </form>

          {/* Séparateur */}
          <div className="mt-3 text-center"> {/* Réduit la marge en haut (mt-4 à mt-3) */}
            <p className="text-sm text-gray-600">ou continuer avec</p>
          </div>

          {/* Icônes de connexion sociale */}
          <div className="mt-2 flex justify-center space-x-4"> {/* Réduit la marge en haut (mt-3 à mt-2) */}
            <a href="#" className="text-gray-500 hover:text-blue-500">
              <Image src="/img/icon-google.svg" alt="Google" width={30} height={30} />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500">
              <Image src="/img/icon-facebook.svg" alt="Facebook" width={30} height={30} />
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500">
              <Image src="/img/icon-linkedin.svg" alt="LinkedIn" width={30} height={30} />
            </a>
          </div>
        </div>

        {/* Section Droite : Image */}
        <div className="w-1/2 relative">
          <Image
            src="/img/user2.svg" // Remplace par le bon chemin
            alt="Illustration de connexion"
            layout="fill"
            objectFit="contain" // Changé de "cover" à "contain"
            className="rounded-r-lg" // Pour arrondir les coins à droite
          />
        </div>
      </div>
    </div>
  );
}