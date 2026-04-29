"use client";

import { ReactNode } from "react";
import MagicSidebar from "./MagicSidebar";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <MagicSidebar />

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        <div className="p-6 lg:p-8">
          {/* Page Header */}
          {(title || description) && (
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {title && (
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-slate-400 text-lg">
                  {description}
                </p>
              )}
            </motion.div>
          )}

          {/* Page Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
