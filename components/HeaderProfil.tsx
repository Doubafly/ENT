"use client";
import { useState } from "react";
import { Bell, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function UserProfile({ user }) {
  const [notificationCount, setNotificationCount] = useState(1);

  return (
    <div className="flex items-center space-x-4 p-3  rounded-xl w-fit mb-3 ">
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
    </div>
  );
}
