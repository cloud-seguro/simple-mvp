"use client";

import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8 inline-block">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-500"
          >
            <line x1="1" y1="1" x2="23" y2="23"></line>
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">No estás conectado</h1>
        <p className="text-gray-600 mb-6">
          Parece que no tienes conexión a internet. La página que intentas
          visitar requiere una conexión activa.
        </p>
        <div>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors mr-4"
          >
            Intentar de nuevo
          </button>
          <Link href="/" className="text-black underline hover:text-gray-700">
            Volver al inicio
          </Link>
        </div>

        {/* Connection status indicator */}
        <div className="mt-8 inline-block px-4 py-2 rounded-full border">
          <span id="connection-status" className="text-sm font-medium">
            Offline
          </span>
        </div>
      </div>
    </div>
  );
}
