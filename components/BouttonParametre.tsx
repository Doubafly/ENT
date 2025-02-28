import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";


interface BoutonParametreProps {
    reglage: () => void;
  onCreateAnnexe: () => void;
  onCreateModule: () => void;
  onCreateAutre: () => void;
}

const BoutonParametre: React.FC<BoutonParametreProps> = ({
    reglage,
  onCreateAnnexe,
  onCreateModule,
  onCreateAutre,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4">
      {/* Bouton Paramètres */}
      <button
        className="flex items-center gap-2 px-2 py-2 rounded-full shadow hover:bg-gray-300"
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
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
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
              onCreateAutre();
            }}
          >
            Autre création
          </button>
        </div>
      )}
    </div>
  );
};

export default BoutonParametre;
