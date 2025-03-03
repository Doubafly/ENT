import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-gradient-to-br from-gray-100 to-gray-300 p-6 rounded-lg shadow-lg relative w-[350px]">
          {children}
        </div>
      </div>
    );
  }
  

