"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { api, saveAuth, type TokenOut } from "@/lib/api";
import GoogleButton from "./GoogleButton";

const inputClass =
  "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-onono-cyan-500/50 focus:ring-1 focus:ring-onono-cyan-500/50 transition-all";

const AuthForm = ({ mode }: { mode: "login" | "register" }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";
  const Icon = isLogin ? LogIn : UserPlus;

  const redirect = (auth: TokenOut) =>
    router.push(auth.user.role === "admin" ? "/admin" : "/");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const auth = await api<TokenOut>(isLogin ? "/auth/login" : "/auth/register", {
        method: "POST",
        body: JSON.stringify(
          isLogin
            ? { email: form.email, password: form.password }
            : form
        ),
      });
      saveAuth(auth);
      redirect(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-b from-onono-midnight-950 via-onono-midnight-900 to-onono-midnight-950 px-4">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-onono-cyan-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-onono-green-500/5 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("auth.backHome")}
        </Link>

        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-onono-cyan-500 to-onono-electric-500 flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">
              {t(isLogin ? "auth.loginTitle" : "auth.registerTitle")}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("auth.name")}
                className={inputClass}
              />
            )}
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t("auth.email")}
              className={inputClass}
            />
            <input
              type="password"
              required
              minLength={isLogin ? undefined : 8}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={t("auth.password")}
              className={inputClass}
            />

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full btn-glow text-onono-midnight-900 font-bold py-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] transition-transform"
            >
              {busy ? (
                <div className="w-5 h-5 border-2 border-onono-midnight-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span>{t(isLogin ? "auth.loginSubmit" : "auth.registerSubmit")}</span>
            </button>
          </form>

          <GoogleButton onSuccess={redirect} />

          <p className="text-sm text-gray-400 text-center mt-6">
            {t(isLogin ? "auth.noAccount" : "auth.haveAccount")}{" "}
            <Link
              href={isLogin ? "/cadastro" : "/login"}
              className="text-onono-cyan-400 hover:text-onono-cyan-300 font-medium transition-colors"
            >
              {t(isLogin ? "auth.registerLink" : "auth.loginLink")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
