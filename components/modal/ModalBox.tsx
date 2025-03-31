"use client";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle } from "react-icons/fa";

interface ModalProps {
  message: string;
  status: "success" | "error" | "info";
}

export default function Modal({ message, status }: ModalProps) {
  const [visible, setVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true); // Déclenche l'animation de sortie
    }, 2000); // Commence à disparaître après 2,5 secondes

    const hideTimer = setTimeout(() => {
      setVisible(false); // Supprime le modal après 3 secondes
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  const getColor = () => {
    switch (status) {
      case "success":
        return "from-green-400 to-green-600 text-white";
      case "error":
        return "from-red-400 to-red-600 text-white";
      default:
        return "from-blue-400 to-blue-600 text-white";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "success":
        return (
          <FaCheckCircle className="w-12 h-12 mx-auto mb-4 animate-bounce" />
        );
      case "error":
        return (
          <FaTimesCircle className="w-12 h-12 mx-auto mb-4 animate-bounce" />
        );
      default:
        return (
          <FaInfoCircle className="w-12 h-12 mx-auto mb-4 animate-bounce" />
        );
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-500 ${
        isExiting ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`bg-gradient-to-br ${getColor()} p-6 rounded-lg shadow-lg relative w-[350px] transform transition-all duration-500 ${
          isExiting ? "scale-90" : "scale-100"
        }`}
      >
        {getIcon()}
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
}
