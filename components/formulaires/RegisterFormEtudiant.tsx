import { useState, useEffect } from "react";
import ListCard, { User } from "@/components/card/ListCard";

type Filiere = {
  id_filiere: number;
  nom: string;
  niveau: string;
};

type RegisterFormProps = {
  onClose: () => void;
  onrecharge: () => Promise<void>;
  onStudentAdded: (newStudent: User) => void;
};

const RegisterFormEtudiant = ({
  onStudentAdded,
  onClose,
  onrecharge,
}: RegisterFormProps) => {
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verificationStep, setVerificationStep] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [allData, setAllData] = useState<any>(null);

  useEffect(() => {
    async function fetchFilieres() {
      try {
        const response = await fetch("/api/filieres");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des filières");
        }
        const data = await response.json();
        setFilieres(data.filieres);
      } catch (error: any) {
        console.error("Erreur :", error.message);
        setError("Erreur lors de la récupération des filières");
      }
    }
    fetchFilieres();
  }, []);
  const sendVerificationEmail = async (data: any) => {
    const reset_code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(reset_code);
    setVerificationStep(true);
    setSuccess("Un code de vérification a été envoyé à votre email.");
    setAllData(data);
    try {
      const response = await fetch(
        "https://codingmailer.onrender.com/send-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: data.email,
            subject: "Code de vérification",
            message: `Votre code de vérification est: ${reset_code}\n\nCe code expirera dans 15 minutes.`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi de l'email de vérification");
      }

      setVerificationStep(true);
      setSuccess("Un code de vérification a été envoyé à votre email.");
    } catch (error: any) {
      setError(
        error.message || "Erreur lors de l'envoi du code de vérification"
      );
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    // Si nous sommes à l'étape de vérification
    if (verificationStep) {
      if (verificationCode !== generatedCode) {
        setError("Code de vérification incorrect");
        return;
      }

      // Si le code est correct, procéder à l'inscription
      try {
        const response = await fetch("/api/utilisateurs/etudiants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nom: allData.nom,
            prenom: allData.prenom,
            email: allData.email,
            sexe: allData.sexe,
            mot_de_passe: allData.mot_de_passe,
            telephone: allData.telephone,
            adresse: allData.adresse,
            matricule: allData.matricule,
            date_naissance: allData.date_naissance,
            date_inscription: allData.date_inscription,
            id_filiere: Number(allData.id_filiere), // ✅ CONVERSION ICI
          }),
        });
        if (response.ok) {
          const { etudiant ,utilisateur} = await response.json();
          onStudentAdded({
            id_utilisateur: etudiant.id_utilisateur,
            nom: utilisateur?.nom || "",
            prenom: utilisateur?.prenom || "",
            email: utilisateur?.email || "",
            sexe: utilisateur?.sexe || "",
            image: utilisateur?.profil || "/profils/default.jpg",
            tel: utilisateur?.telephone || "",
            adresse: utilisateur?.adresse || "",
            matricule:etudiant.matricule,
            filiere: {
              id_filiere: etudiant.filiere?.id_filiere || 0,
              nom: etudiant.filiere?.nom || "Non assigné",
              filiere_module: etudiant.filiere?.filiere_module,
            },
            date_naissance: etudiant.date_naissance || "",
            date_inscription: etudiant.date_inscription,
            id: 0,
            notes: undefined,
            mot_de_passe: "",
          });
          console.log(etudiant);
          
            const res = await fetch(
              "https://codingmailer.onrender.com/send-email",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  to: utilisateur?.email,
                  subject: "Smart School l'avenir de l'education",
                  message: `Bienvenue sur notre patforme: ${utilisateur?.nom} ${utilisateur?.prenom}\n\n Votre code de connexion est le: ${allData?.mot_de_passe} vous pouvez le modifier directement dans l'application.`,
                }),
              }
            );

            if (!res.ok) {
              setError(
                `Erreur lors de l'envoi du mot de passe ${res.statusText}`
              );
            }
          setSuccess("Étudiant créé avec succès !");
          setTimeout(() => {
            setSuccess(null);
            onrecharge();
            onClose();
          }, 2000);
        } else {
          console.error("Erreur lors de l'ajout :", await response.text());
          throw new Error("Erreur lors de la création de l'étudiant");
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors de la requête");
      }
    } else {
      // Sinon, envoyer le code de vérification
      await sendVerificationEmail(data as any);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg border w-full max-w-2xl">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          onClick={onClose}
        >
          x
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-lg font-bold text-center mb-3">
            {verificationStep ? "Vérification d'email" : "Créer un étudiant"}
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}

          {verificationStep ? (
            <div className="space-y-4">
              <p className="text-center">
                Un code de vérification a été envoyé à l'adresse email fournie.
                Veuillez le saisir ci-dessous.
              </p>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Code de vérification :
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-center mt-3">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 text-sm"
                >
                  Vérifier et créer
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Nom :
                </label>
                <input
                  type="text"
                  name="nom"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Prénom :
                </label>
                <input
                  type="text"
                  name="prenom"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Email :
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Mot de passe :
                </label>
                <input
                  type="password"
                  name="mot_de_passe"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Sexe :
                </label>
                <select
                  title="sexe"
                  name="sexe"
                  className="w-full p-2 border rounded-lg text-sm"
                  required
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Téléphone :
                </label>
                <input
                  type="text"
                  name="telephone"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Adresse :
                </label>
                <input
                  type="text"
                  name="adresse"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Matricule :
                </label>
                <input
                  type="text"
                  name="matricule"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Date de naissance :
                </label>
                <input
                  type="date"
                  name="date_naissance"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Date d'inscription :
                </label>
                <input
                  type="date"
                  name="date_inscription"
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold">
                  Filière :
                </label>
                <select
                  title="filiere"
                  name="id_filiere"
                  className="w-full p-2 border rounded-lg text-sm"
                  required
                >
                  {filieres.length > 0 ? (
                    filieres.map((filiere) => (
                      <option
                        key={filiere.id_filiere}
                        value={filiere.id_filiere}
                      >
                        {`${
                          filiere.niveau === "Primaire"
                            ? "L1"
                            : filiere.niveau === "Secondaire"
                            ? "L2"
                            : filiere.niveau === "Licence"
                            ? "L3"
                            : ""
                        } ${filiere.nom}`}
                      </option>
                    ))
                  ) : (
                    <option disabled>Chargement...</option>
                  )}
                </select>
              </div>
              <div className="flex justify-center mt-3 col-span-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 text-sm"
                >
                  Envoyer le code de vérification
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterFormEtudiant;
