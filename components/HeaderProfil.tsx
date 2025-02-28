"use client";
import { useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import Image from "next/image";
import BoutonParametre from "./BouttonParametre";
import FormulaireAnnexe from "./formulaires/FormulaireAnnexe";
import FormulaireModule from "./formulaires/FormulaireModule";
import ParametrePage from "@/app/(root)/admin/parametre/page";

export default function UserProfile({ user }) {
  const [notificationCount, setNotificationCount] = useState(1);
  const [isAnnexeOpen, setIsAnnexeOpen] = useState(false);
  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [isParametreOpen, setIsParametreOpen] = useState(false);
  

  function handleRegisterSubmit(formData: FormData): Promise<void> {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex items-center p-3  rounded-xl mb-3 ">
      <div className="flex space-x-2">
        <button
          title="message"
          className="relative p-2 rounded-full bg-white shadow"
        >
          <MessageCircle className="w-5 h-5 text-gray-600" />
        </button>
        <button
          title="Notifiacation"
          className="relative p-2 rounded-full bg-white shadow"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {notificationCount}
            </span>
          )}
        </button>
        <BoutonParametre
            reglage={() => setIsParametreOpen(true)}
            onCreateAnnexe={() => setIsAnnexeOpen(true)}
            onCreateModule={() => setIsModuleOpen(true)}
            onCreateAutre={() => console.log("Creer dautre chose")}
            />
      </div>
      <div>
        <p className="text-lg font-bold">
          {" "}
          {user.firstName} {user.lastName}
        </p>
        <p className="text-gray-600">{user.role}</p>
      </div>
      <div className="w-10 h-10 bg-gray-300 rounded-full">
        <Image
          className=" rounded-full w-full h-full"
          src={"/img/man1.jpg"}
          width={100}
          height={100}
          title="Profil"
          alt="Profil"
        />
      </div>
        {/* Overlay et formulaire modal pour le Annexe  avec boutton parametre*/}
        {isAnnexeOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 w-full"
          onClick={() => setIsAnnexeOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-3 shadow-lg lg:px-8 lg:py-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <FormulaireAnnexe
              onSubmit={handleRegisterSubmit}
              title="Inscription d'un nouvel étudiant"
            />
          </div>
        </div>
      )}

       {/* Overlay et formulaire modal pour le Module avec bouton parametre */}
       {isModuleOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModuleOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-3 shadow-lg lg:px-8 lg:py-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <FormulaireModule
              onSubmit={handleRegisterSubmit}
              title="Inscription d'un nouvel étudiant"
            />
          </div>
        </div>
      )}

      {/* Overlay et ouvrage de la page parametre avec bouton parametre */}
      {isParametreOpen && (
       
            <ParametrePage
            />
        
      
      )}
    </div>
  );
}
