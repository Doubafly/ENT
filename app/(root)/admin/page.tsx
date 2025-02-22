"use client";
import RightSidebar from "@/components/RightSidebar";
import Statistique from "@/components/statistique/statistique";

export default function Home() {
  const user = {
    role: "Admin",
    firstName: "Mamadou",
    lastName: "Ba",
    email: "ba6353158@gmail.com",
  };
  return (
    <section className="home">
      <div className="home-content">
        <Statistique />
      </div>
      <RightSidebar />
    </section>
  );
}
