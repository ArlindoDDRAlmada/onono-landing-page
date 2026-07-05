"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Inbox,
  LogOut,
  Mail,
  MailOpen,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { api, clearAuth, getUser, type User } from "@/lib/api";

type Message = {
  id: number;
  name: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  message: string;
  read: boolean;
  created_at: string;
};

type Filter = "all" | "unread" | "read";

export default function AdminPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setMessages(await api<Message[]>("/messages"));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, []);

  useEffect(() => {
    const u = getUser();
    if (!u || u.role !== "admin") {
      router.replace("/login");
      return;
    }
    setUser(u);
    load();
  }, [router, load]);

  const markRead = async (id: number) => {
    const updated = await api<Message>(`/messages/${id}/read`, { method: "PATCH" });
    setMessages((prev) =>
      prev ? prev.map((m) => (m.id === id ? updated : m)) : prev
    );
  };

  const logout = () => {
    clearAuth();
    router.push("/");
  };

  if (!user) return null;

  const filtered = (messages ?? []).filter((m) =>
    filter === "all" ? true : filter === "read" ? m.read : !m.read
  );
  const unreadCount = (messages ?? []).filter((m) => !m.read).length;

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: t("admin.all") },
    { key: "unread", label: t("admin.unread") },
    { key: "read", label: t("admin.read") },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-onono-midnight-950 via-onono-midnight-900 to-onono-midnight-950 relative">
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-onono-cyan-500 to-onono-electric-500 flex items-center justify-center">
              <Inbox className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white font-display">
                {t("admin.title")}
              </h1>
              <p className="text-sm text-gray-400">
                {user.name} · {unreadCount} {t("admin.unread").toLowerCase()}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {t("auth.logout")}
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === f.key
                  ? "bg-gradient-to-r from-onono-cyan-500 to-onono-electric-500 text-onono-midnight-900"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-6">
            {error}
          </p>
        )}

        {/* Messages */}
        {messages === null && !error ? (
          <p className="text-gray-400">{t("admin.loading")}</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400">{t("admin.empty")}</p>
        ) : (
          <div className="space-y-4">
            {filtered.map((m) => (
              <div
                key={m.id}
                className={`glass-card p-6 ${m.read ? "opacity-70" : ""}`}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                      {m.read ? (
                        <MailOpen className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Mail className="w-5 h-5 text-onono-cyan-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-white font-semibold">{m.name}</h3>
                        {m.service && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-onono-cyan-500/10 border border-onono-cyan-500/20 text-onono-cyan-400">
                            {m.service}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {m.email}
                        {m.company && ` · ${m.company}`}
                        {m.phone && ` · ${m.phone}`}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>

                <p className="text-gray-300 mt-4 whitespace-pre-wrap">
                  {m.message}
                </p>

                {!m.read && (
                  <button
                    onClick={() => markRead(m.id)}
                    className="mt-4 flex items-center gap-2 text-sm text-onono-cyan-400 hover:text-onono-cyan-300 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t("admin.markRead")}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
