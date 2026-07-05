"use client";

import { useEffect, useRef } from "react";
import { api, saveAuth, type TokenOut } from "@/lib/api";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (el: HTMLElement, options: object) => void;
        };
      };
    };
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/** Botão "Entrar com Google" (Google Identity Services). Invisível se o Client ID não estiver configurado. */
const GoogleButton = ({ onSuccess }: { onSuccess: (auth: TokenOut) => void }) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CLIENT_ID || !divRef.current) return;

    const render = () => {
      if (!window.google || !divRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (response: { credential: string }) => {
          const auth = await api<TokenOut>("/auth/google", {
            method: "POST",
            body: JSON.stringify({ credential: response.credential }),
          });
          saveAuth(auth);
          onSuccess(auth);
        },
      });
      window.google.accounts.id.renderButton(divRef.current, {
        theme: "filled_black",
        size: "large",
        width: 320,
      });
    };

    if (window.google) {
      render();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = render;
      document.head.appendChild(script);
    }
  }, [onSuccess]);

  if (!CLIENT_ID) return null;

  return (
    <>
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-gray-500 uppercase tracking-wider">ou</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>
      <div ref={divRef} className="flex justify-center" />
    </>
  );
};

export default GoogleButton;
