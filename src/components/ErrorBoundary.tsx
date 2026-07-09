"use client";

import React from "react";

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-onono-midnight-900 px-4">
          <div className="glass-card p-8 max-w-md text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              Algo correu mal.
            </h2>
            <p className="text-gray-400 text-sm">
              Por favor recarregue a página. Se o problema persistir,
              contacte-nos em administrative@onono-technologies.com.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
