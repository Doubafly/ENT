import Image from "next/image";
import Link from "next/link";
import React from "react";
import Calendrier from "./Calendrier";
import UserProfile from "./HeaderProfil";

const RightSidebar = () => {
  return (
    <aside className="right-sidebar mt-8">
      {/* <section className="flex flex-col pb-8">
        <div className="profile-banner" />
        <div className="profile">
          <div className="profile-img">
            <span className="text-5xl font-bold text-blue-500">
              {user.firstName[0]}
            </span>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">
              {user.firstName} {user.lastName}
            </h1>
            <p className="profile-email"> {user.email}</p>
          </div>
        </div>
      </section> */}
      <section className="">
        {/* <div className="flex w-full justify-between">
          <h2 className="header-2"> list....</h2>
          <Link href="/" className="flex gap-2">
            <Image src="/logo.ico" width={20} height={20} alt="plus" />
            <h2 className="text-14 font-semibold text-gray-600">Dou</h2>
          </Link>
        </div> */}
        <Calendrier />
      </section>
    </aside>
  );
};

export default RightSidebar;
