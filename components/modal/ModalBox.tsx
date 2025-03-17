import { useEffect, useState } from "react";

interface ModalProps {
  message: string;
  status: "success" | "error" | "info";
}

export default function Modal({ message, status }: ModalProps) {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState("opacity-0");

  useEffect(() => {
    setOpacity("opacity-100");
    const timer = setTimeout(() => setOpacity("opacity-0"), 2500); // Disparaît avant la suppression
    const hideTimer = setTimeout(() => setVisible(false), 3000);

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

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-500 ${opacity}`}
    >
      <div
        className={`bg-gradient-to-br ${getColor()} p-6 rounded-lg shadow-lg relative w-[350px]`}
      >
        <p className="text-center">{message}</p>
      </div>
    </div>
  );
}
