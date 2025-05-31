import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 px-4 text-center">
      <div className="flex items-center gap-2 mb-6 text-yellow-500">
        <AlertTriangle size={48} />
        <h1 className="text-4xl font-bold">404 - Page non trouvée</h1>
      </div>
      <p className="text-lg text-gray-600 mb-6">
        Oups ! La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
