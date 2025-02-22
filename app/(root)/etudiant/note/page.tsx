"use client";
import Semesters from "@/components/table/SemestreTableau";
import SmallIconCard from "@/components/card/IconCard";
import UserProfile from "@/components/HeaderProfil";

export default function page() {
  return (
    <div>
      <div className="">
        {/* <div className="m-2">
          <SmallIconCard
            photoName="/icons/Close.png"
            stats="0"
            name="Matier non valide"
          />
        </div>
        <div className="">
          <SmallIconCard
            photoName="/icons/Bookmark.png"
            stats="2"
            name="Nombre d'abscences"
          />
        </div> */}
      </div>

      <div className="mt-8">
        <Semesters />
      </div>
      <button
        className=" float-right mr-12 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={print}
      >
        Imprimer{" "}
      </button>
    </div>
  );
}
