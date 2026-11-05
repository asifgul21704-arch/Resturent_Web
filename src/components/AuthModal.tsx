import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, Phone, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginUser,
    registerUser,
    showToast
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin') {
      const res = await loginUser(email, password);
      if (res.success) {
        showToast(`Welcome back, ${res.user?.name}!`, 'success');
        setIsAuthModalOpen(false);
      } else {
        showToast(res.message || 'Login failed', 'warning');
      }
    } else {
      const res = await registerUser({
        name,
        email,
        phone,
        password
      });
      if (res.success) {
        showToast(`Welcome to Foody, ${res.user?.name}!`, 'success');
        setIsAuthModalOpen(false);
      } else {
        showToast(res.message || 'Registration failed', 'warning');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-[36px] max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#EDE7DD] relative my-6"
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EDE7DD] flex items-center justify-center text-[#2C2724]"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#E85B43] text-white text-2xl flex items-center justify-center mx-auto mb-2 shadow-lg shadow-[#E85B43]/20">
            🍔
          </div>
          <h2 className="text-2xl font-black text-[#2C2724] font-display">
            {mode === 'signin' ? 'Welcome Back to Foody' : 'Join Foody Delivery'}
          </h2>
          <p className="text-xs text-[#78716A] mt-1">
            {mode === 'signin'
              ? 'Sign in to access your saved orders, GPS tracking & vouchers'
              : 'Create an account to unlock fast checkout & 20% off'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-[#FAF7F2] p-1 rounded-2xl mb-5">
          <button
            onClick={() => setMode('signin')}
            className={`py-2 text-xs font-black rounded-xl transition-all ${
              mode === 'signin' ? 'bg-white text-[#2C2724] shadow-xs' : 'text-[#78716A]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`py-2 text-xs font-black rounded-xl transition-all ${
              mode === 'signup' ? 'bg-white text-[#2C2724] shadow-xs' : 'text-[#78716A]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Custom Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C847A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Mitchell"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#57514B] block mb-1">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8C847A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
                  />
                </div>
              </div>


            </>
          )}

          <div>
            <label className="text-xs font-bold text-[#57514B] block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C847A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#57514B] block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C847A] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-[#FAF7F2] border border-[#EDE7DD] rounded-xl text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#E85B43] hover:bg-[#D44730] text-white font-black text-xs uppercase tracking-wider rounded-full shadow-lg shadow-[#E85B43]/25 active:scale-95 transition-all"
          >
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

      </motion.div>
    </div>
  );
};
