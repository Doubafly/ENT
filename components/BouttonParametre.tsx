import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

interface BoutonParametreProps {
  reglage: () => void;
  onCreateRole: () => void;
  onCreateAnnexe: () => void;
  onCreateModule: () => void;
  onCreateFiliere: () => void;
}

const BoutonParametre: React.FC<BoutonParametreProps> = ({
  reglage,
  onCreateRole,
  onCreateAnnexe,
  onCreateModule,
  onCreateFiliere,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex space-x-2">
      {/* Bouton Paramètres */}
      <button
        className="relative p-2 rounded-full bg-white shadow"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <Image
          src="/icons/settings.png"
          alt="Paramètres"
          width={20}
          height={20}
        />
      </button>

      {/* Menu déroulant en dessous du bouton */}
      {isMenuOpen && (
        <div className="fixed right-8 mt-10 w-48 bg-white border rounded shadow-lg">
          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={() => {
              setIsMenuOpen(false);
              reglage();
            }}
          >
            Parametre
          </button>

          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={() => {
              setIsMenuOpen(false);
              onCreateRole();
            }}
          >
            Creer un Role
          </button>

          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={() => {
              setIsMenuOpen(false);
              onCreateAnnexe();
            }}
          >
            Creer une annexe
          </button>

          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={() => {
              setIsMenuOpen(false);
              onCreateModule();
            }}
          >
            Creer un module
          </button>

          <button
            className="w-full px-4 py-2 text-left hover:bg-gray-200"
            onClick={() => {
              setIsMenuOpen(false);
              onCreateFiliere();
            }}
          >
            Creer une filiere
          </button>
        </div>
      )}
    </div>
  );
};

export default BoutonParametre;
