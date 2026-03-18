import React from 'react';
import { Navbar } from '../components/Navbar';
import { Shield, PieChart, Zap, ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Home = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 py-20 md:py-32 text-center max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[90vh]">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs sm:text-sm font-medium mb-6 md:mb-8 border border-indigo-100">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600"></span>
              The Future of Expense Tracking
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Smart Expense Tracking for the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Modern Era
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
              Take control of your finances with LUMERAY. Track, analyze, and optimise your spending
              with our beautifully designed, intelligent dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 hover:-translate-y-1"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                Log in
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </section>

        {/* What is LUMERAY? */}
        <motion.section
          className="bg-gray-50 py-20 md:py-32 px-4 sm:px-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 md:mb-8">What is LUMERAY?</h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              LUMERAY is a full-stack, intelligent expense tracking platform designed to give you complete
              visibility into your financial habits. Whether you're tracking daily coffees or monthly bills,
              LUMERAY provides a seamless, secure, and beautiful interface to manage your money efficiently.
            </p>
          </div>
        </motion.section>

        {/* Features */}
        <section className="py-20 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Features of LUMERAY</h2>
            <p className="text-base md:text-lg text-gray-600">Everything you need to manage your expenses like a pro.</p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              {
                icon: <Zap className="w-8 h-8 text-indigo-600" />,
                title: "Lightning Fast",
                desc: "Add expenses in seconds. Our optimised platform ensures your data is always up-to-date instantly."
              },
              {
                icon: <PieChart className="w-8 h-8 text-indigo-600" />,
                title: "Smart Analytics",
                desc: "Visualise your spending patterns with beautiful, interactive charts and category breakdowns."
              },
              {
                icon: <Shield className="w-8 h-8 text-indigo-600" />,
                title: "Bank-Grade Security",
                desc: "Your data is protected with industry-standard JWT authentication and secure database encryption."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="p-6 md:p-8 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:bg-indigo-600 transition-colors">
                  {React.cloneElement(feature.icon as React.ReactElement, {
                    className: "w-7 h-7 md:w-8 md:h-8 text-indigo-600 group-hover:text-white transition-colors"
                  })}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3 md:mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ── How to use — FIXED alignment ── */}
        <section className="bg-slate-900 text-white py-20 md:py-32 px-4 sm:px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div
              className="text-center mb-16 md:mb-20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">How to use LUMERAY?</h2>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">
                Get started in three simple steps and take control of your financial journey today.
              </p>
            </motion.div>

            <motion.div
              className="grid sm:grid-cols-3 gap-8 md:gap-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {[
                {
                  step: "01",
                  title: "Create an Account",
                  desc: "Click 'Get Started' to join LUMERAY. New users start with a clean slate of $0 expenses."
                },
                {
                  step: "02",
                  title: "Log your Expenses",
                  desc: "Use the Dashboard to quickly add new transactions with categories and descriptions."
                },
                {
                  step: "03",
                  title: "Analyse & Optimise",
                  desc: "Check the Analytics tab to view your spending trends and take control of your budget."
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeInUp}
                  // ✅ FIX: Removed absolute positioning on the step number.
                  // Using flex column layout so number, title and text
                  // are always consistently aligned across all 3 cards.
                  className="flex flex-col"
                >
                  {/* Step number — sits inline above the border, no absolute positioning */}
                  <div className="text-6xl md:text-7xl font-black text-indigo-500/20 leading-none mb-4 select-none">
                    {item.step}
                  </div>
                  <div className="border-t-2 border-indigo-500/30 pt-6">
                    <h4 className="text-xl md:text-2xl font-semibold mb-3 text-white">{item.title}</h4>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-8 md:py-10 border-t border-gray-100 text-center px-4">
        <p className="text-gray-500 text-sm font-medium">© 2026 LUMERAY. All rights reserved.</p>
      </footer>
    </div>
  );
};
