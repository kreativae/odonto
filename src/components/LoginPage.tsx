import { useState, useEffect } from 'react';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Building2, ArrowRight,
  Check, Shield, BarChart3, Users, Calendar, Sparkles, ChevronLeft,
  MapPin, FileText, AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  clinicName: string;
  avatar: string;
}

type AuthView = 'login' | 'register' | 'forgot' | 'verify';

interface FormErrors {
  [key: string]: string;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState(1);
  const [animating, setAnimating] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regClinicName, setRegClinicName] = useState('');
  const [regClinicCNPJ, setRegClinicCNPJ] = useState('');
  const [regClinicAddress, setRegClinicAddress] = useState('');
  const [regRole, setRegRole] = useState('admin');
  const [regAgreeTerms, setRegAgreeTerms] = useState(false);
  const [regPlan, setRegPlan] = useState('pro');

  // Forgot password
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Verification code
  const [verifyCode, setVerifyCode] = useState(['', '', '', '', '', '']);

  // Animated background particles
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))
  );

  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => setAnimating(false), 400);
    return () => clearTimeout(timer);
  }, [view, step]);

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const formatCNPJ = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  };

  const validateLogin = (): boolean => {
    const newErrors: FormErrors = {};
    if (!loginEmail.trim()) newErrors.loginEmail = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) newErrors.loginEmail = 'Email inválido';
    if (!loginPassword.trim()) newErrors.loginPassword = 'Senha é obrigatória';
    else if (loginPassword.length < 6) newErrors.loginPassword = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!regName.trim()) newErrors.regName = 'Nome é obrigatório';
    if (!regEmail.trim()) newErrors.regEmail = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(regEmail)) newErrors.regEmail = 'Email inválido';
    if (!regPhone.trim()) newErrors.regPhone = 'Telefone é obrigatório';
    if (!regPassword.trim()) newErrors.regPassword = 'Senha é obrigatória';
    else if (regPassword.length < 8) newErrors.regPassword = 'Mínimo 8 caracteres';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(regPassword)) newErrors.regPassword = 'Use maiúscula, minúscula e número';
    if (regPassword !== regConfirmPassword) newErrors.regConfirmPassword = 'Senhas não conferem';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!regClinicName.trim()) newErrors.regClinicName = 'Nome da clínica é obrigatório';
    if (!regAgreeTerms) newErrors.regAgreeTerms = 'Você precisa aceitar os termos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    onLogin({
      id: '1',
      name: 'Admin Clínica',
      email: loginEmail,
      role: 'Admin',
      clinicName: 'Clínica Sorriso',
      avatar: 'AC',
    });
  };

  const handleRegister = async () => {
    if (!validateRegisterStep2()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setView('verify');
  };

  const handleVerify = async () => {
    const code = verifyCode.join('');
    if (code.length < 6) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    onLogin({
      id: '2',
      name: regName,
      email: regEmail,
      role: regRole === 'admin' ? 'Admin' : 'Dentista',
      clinicName: regClinicName,
      avatar: regName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    });
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setErrors({ forgotEmail: 'Email inválido' });
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setForgotSent(true);
  };

  const handleVerifyCodeInput = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newCode = [...verifyCode];
    newCode[index] = value;
    setVerifyCode(newCode);
    if (value && index < 5) {
      const next = document.getElementById(`verify-${index + 1}`);
      next?.focus();
    }
  };

  const handleVerifyKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verifyCode[index] && index > 0) {
      const prev = document.getElementById(`verify-${index - 1}`);
      prev?.focus();
    }
  };

  const passwordStrength = (): { score: number; label: string; color: string } => {
    let score = 0;
    if (regPassword.length >= 8) score++;
    if (/[a-z]/.test(regPassword)) score++;
    if (/[A-Z]/.test(regPassword)) score++;
    if (/\d/.test(regPassword)) score++;
    if (/[^a-zA-Z\d]/.test(regPassword)) score++;
    if (score <= 1) return { score, label: 'Fraca', color: 'bg-red-500' };
    if (score <= 2) return { score, label: 'Razoável', color: 'bg-orange-500' };
    if (score <= 3) return { score, label: 'Boa', color: 'bg-yellow-500' };
    if (score <= 4) return { score, label: 'Forte', color: 'bg-green-500' };
    return { score, label: 'Muito Forte', color: 'bg-emerald-500' };
  };

  const features = [
    { icon: Calendar, label: 'Agenda Inteligente', desc: 'Confirmação automática via WhatsApp' },
    { icon: Users, label: 'Gestão de Pacientes', desc: 'Prontuário eletrônico completo' },
    { icon: BarChart3, label: 'Pipeline Comercial', desc: 'Kanban com funil de vendas' },
    { icon: Sparkles, label: 'IA Integrada', desc: 'Insights e previsões inteligentes' },
  ];

  const plans = [
    { id: 'starter', name: 'Starter', price: 'R$ 97', period: '/mês', features: ['1 profissional', '100 pacientes', 'Agenda básica', 'Suporte email'] },
    { id: 'pro', name: 'Profissional', price: 'R$ 197', period: '/mês', features: ['5 profissionais', 'Pacientes ilimitados', 'Pipeline + Financeiro', 'WhatsApp integrado', 'IA Insights'], popular: true },
    { id: 'enterprise', name: 'Enterprise', price: 'R$ 397', period: '/mês', features: ['Ilimitado', 'Multi-clínica', 'API completa', 'Suporte prioritário', 'IA avançada', 'White label'] },
  ];

  const inputClass = (field: string) =>
    `w-full pl-11 pr-4 py-3 rounded-xl border ${errors[field]
      ? 'border-red-400 dark:border-red-500 ring-2 ring-red-100 dark:ring-red-900/30'
      : 'border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
    } bg-white dark:bg-slate-700/50 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all`;

  const renderInputError = (field: string) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <AlertCircle size={12} /> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-primary-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-primary-400/15 dark:bg-primary-400/8"
            style={{
              width: p.size + 'px',
              height: p.size + 'px',
              left: p.x + '%',
              top: p.y + '%',
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-400/15 to-dental-400/15 blur-3xl animate-float-soft" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-dental-400/15 to-primary-400/15 blur-3xl animate-float-soft" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* LEFT PANEL – Hero / Features */}
      <div className="hidden lg:flex flex-col justify-between w-[55%] xl:w-[50%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-dental-700 animate-gradient" />
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center">
              <span className="text-2xl">🦷</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Odonto Pro</h1>
              <p className="text-xs text-white/60">CRM Inteligente</p>
            </div>
          </div>

          {/* Hero text */}
          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
              Transforme sua clínica em uma
              <span className="relative ml-2">
                <span className="relative z-10 text-dental-300">máquina de resultados</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-dental-400/30 rounded" />
              </span>
            </h2>
            <p className="text-white/70 text-lg mb-12 leading-relaxed">
              O CRM odontológico mais completo do mercado. Gerencie pacientes, agenda, financeiro e pipeline comercial com inteligência artificial.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            {features.map((feat, i) => (
              <div
                key={i}
                className={`bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/20 transition-all duration-300 group card-hover animate-pop-in stagger-${i + 1}`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <feat.icon size={20} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-sm mb-1">{feat.label}</h3>
                <p className="text-white/50 text-xs font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom stats */}
        <div className="relative z-10 p-12 xl:p-16">
          <div className="flex gap-12">
            <div>
              <div className="text-3xl font-extrabold text-white">2.500+</div>
              <div className="text-white/50 text-sm">Clínicas ativas</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">1.2M</div>
              <div className="text-white/50 text-sm">Pacientes gerenciados</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-white">99.9%</div>
              <div className="text-white/50 text-sm">Uptime</div>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['bg-emerald-400', 'bg-blue-400', 'bg-purple-400', 'bg-orange-400', 'bg-pink-400'].map((c, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-primary-700 flex items-center justify-center text-[10px] font-bold text-white`}>
                  {['DR', 'AM', 'CS', 'LP', 'MK'][i]}
                </div>
              ))}
            </div>
            <p className="text-white/50 text-xs">+2.500 profissionais confiam no Odonto Pro</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL – Forms */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className={`w-full max-w-md transition-all duration-500 ease-out ${animating ? 'opacity-0 translate-y-6 scale-98' : 'opacity-100 translate-y-0 scale-100'}`}>

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-dental-500 flex items-center justify-center">
              <span className="text-xl">🦷</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Odonto Pro</h1>
              <p className="text-[10px] text-slate-400">CRM Inteligente</p>
            </div>
          </div>

          {/* ==================== LOGIN ==================== */}
          {view === 'login' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                  Bem-vindo de volta 👋
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Entre na sua conta para acessar o painel
                </p>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium text-slate-700 dark:text-slate-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12c0-5.523-4.477-10-10-10z"/></svg>
                  Facebook
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                <span className="text-xs text-slate-400 dark:text-slate-500">ou continue com email</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              </div>

              {/* Email field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={e => { setLoginEmail(e.target.value); setErrors(prev => ({ ...prev, loginEmail: '' })); }}
                    placeholder="seu@email.com"
                    className={inputClass('loginEmail')}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                {renderInputError('loginEmail')}
              </div>

              {/* Password field */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
                  <button
                    onClick={() => { setView('forgot'); setErrors({}); }}
                    className="text-xs text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={e => { setLoginPassword(e.target.value); setErrors(prev => ({ ...prev, loginPassword: '' })); }}
                    placeholder="••••••••"
                    className={`${inputClass('loginPassword')} pr-11`}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {renderInputError('loginPassword')}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    rememberMe
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {rememberMe && <Check size={14} className="text-white" />}
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-400">Lembrar de mim</span>
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/40 btn-press btn-glow"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Demo login hint */}
              <div className="mt-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                <p className="text-xs text-primary-600 dark:text-primary-400 text-center">
                  💡 <strong>Demo:</strong> Use qualquer email e senha para entrar
                </p>
              </div>

              {/* Register link */}
              <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Não tem uma conta?{' '}
                <button
                  onClick={() => { setView('register'); setStep(1); setErrors({}); }}
                  className="text-primary-500 hover:text-primary-600 font-semibold"
                >
                  Cadastre-se grátis
                </button>
              </p>
            </div>
          )}

          {/* ==================== REGISTER ==================== */}
          {view === 'register' && (
            <div>
              {/* Back button */}
              <button
                onClick={() => {
                  if (step > 1) { setStep(step - 1); setErrors({}); }
                  else { setView('login'); setErrors({}); }
                }}
                className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-6 transition-colors"
              >
                <ChevronLeft size={18} /> {step > 1 ? 'Voltar' : 'Voltar ao login'}
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                  {step === 1 ? 'Crie sua conta 🚀' : step === 2 ? 'Dados da Clínica 🏥' : 'Escolha seu plano 💎'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {step === 1 ? 'Preencha seus dados pessoais' : step === 2 ? 'Configure sua clínica no sistema' : 'Selecione o plano ideal para você'}
                </p>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2 mb-8">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex-1 flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      s < step ? 'bg-emerald-500 text-white' :
                      s === step ? 'bg-primary-500 text-white ring-4 ring-primary-100 dark:ring-primary-900/30' :
                      'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }`}>
                      {s < step ? <Check size={14} /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`flex-1 h-1 rounded-full transition-all ${
                        s < step ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Personal Data */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome completo</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={regName}
                        onChange={e => { setRegName(e.target.value); setErrors(prev => ({ ...prev, regName: '' })); }}
                        placeholder="Dr. João Silva"
                        className={inputClass('regName')}
                      />
                    </div>
                    {renderInputError('regName')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={e => { setRegEmail(e.target.value); setErrors(prev => ({ ...prev, regEmail: '' })); }}
                        placeholder="seu@email.com"
                        className={inputClass('regEmail')}
                      />
                    </div>
                    {renderInputError('regEmail')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telefone / WhatsApp</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={regPhone}
                        onChange={e => { setRegPhone(formatPhone(e.target.value)); setErrors(prev => ({ ...prev, regPhone: '' })); }}
                        placeholder="(11) 99999-9999"
                        className={inputClass('regPhone')}
                      />
                    </div>
                    {renderInputError('regPhone')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Senha</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={e => { setRegPassword(e.target.value); setErrors(prev => ({ ...prev, regPassword: '' })); }}
                        placeholder="Mínimo 8 caracteres"
                        className={`${inputClass('regPassword')} pr-11`}
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {regPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${passwordStrength().color}`}
                              style={{ width: `${(passwordStrength().score / 5) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{passwordStrength().label}</span>
                        </div>
                      </div>
                    )}
                    {renderInputError('regPassword')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirmar senha</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={e => { setRegConfirmPassword(e.target.value); setErrors(prev => ({ ...prev, regConfirmPassword: '' })); }}
                        placeholder="Repita a senha"
                        className={`${inputClass('regConfirmPassword')} pr-11`}
                      />
                      <button
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {regConfirmPassword && regPassword === regConfirmPassword && (
                      <p className="mt-1 text-xs text-emerald-500 flex items-center gap-1"><Check size={12} /> Senhas conferem</p>
                    )}
                    {renderInputError('regConfirmPassword')}
                  </div>

                  <button
                    onClick={() => { if (validateRegisterStep1()) { setStep(2); setErrors({}); } }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98]"
                  >
                    Continuar <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* Step 2: Clinic Data */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome da Clínica</label>
                    <div className="relative">
                      <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={regClinicName}
                        onChange={e => { setRegClinicName(e.target.value); setErrors(prev => ({ ...prev, regClinicName: '' })); }}
                        placeholder="Clínica Sorriso"
                        className={inputClass('regClinicName')}
                      />
                    </div>
                    {renderInputError('regClinicName')}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">CNPJ <span className="text-slate-400 font-normal">(opcional)</span></label>
                    <div className="relative">
                      <FileText size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={regClinicCNPJ}
                        onChange={e => setRegClinicCNPJ(formatCNPJ(e.target.value))}
                        placeholder="00.000.000/0000-00"
                        className={inputClass('regClinicCNPJ')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Endereço <span className="text-slate-400 font-normal">(opcional)</span></label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={regClinicAddress}
                        onChange={e => setRegClinicAddress(e.target.value)}
                        placeholder="Rua, número, bairro, cidade"
                        className={inputClass('regClinicAddress')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Seu perfil no sistema</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'admin', label: '👑 Admin da Clínica', desc: 'Acesso total' },
                        { id: 'dentist', label: '🦷 Dentista', desc: 'Clínico' },
                        { id: 'secretary', label: '💼 Secretária', desc: 'Atendimento' },
                        { id: 'manager', label: '📊 Gestor', desc: 'Gestão' },
                      ].map(role => (
                        <button
                          key={role.id}
                          onClick={() => setRegRole(role.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            regRole === role.id
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{role.label}</div>
                          <div className="text-xs text-slate-400">{role.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => { setRegAgreeTerms(!regAgreeTerms); setErrors(prev => ({ ...prev, regAgreeTerms: '' })); }}
                      className={`w-5 h-5 mt-0.5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        regAgreeTerms
                          ? 'bg-primary-500 border-primary-500'
                          : errors.regAgreeTerms ? 'border-red-400' : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      {regAgreeTerms && <Check size={14} className="text-white" />}
                    </button>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      Concordo com os{' '}
                      <button className="text-primary-500 hover:underline font-medium">Termos de Uso</button>
                      {' '}e{' '}
                      <button className="text-primary-500 hover:underline font-medium">Política de Privacidade</button>
                    </span>
                  </div>
                  {renderInputError('regAgreeTerms')}

                  <button
                    onClick={() => { if (validateRegisterStep2()) { setStep(3); setErrors({}); } }}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-500/25 active:scale-[0.98]"
                  >
                    Continuar <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* Step 3: Plan Selection */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    {plans.map(plan => (
                      <button
                        key={plan.id}
                        onClick={() => setRegPlan(plan.id)}
                        className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative ${
                          regPlan === plan.id
                            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 shadow-lg shadow-primary-500/10'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        {plan.popular && (
                          <span className="absolute -top-2.5 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-primary-500 to-dental-500 text-white text-[10px] font-bold uppercase tracking-wider">
                            Popular
                          </span>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{plan.name}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                            <span className="text-sm text-slate-400">{plan.period}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {plan.features.map((f, i) => (
                            <span key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Check size={12} className="text-emerald-500" /> {f}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
                    <p className="text-xs text-amber-700 dark:text-amber-400 text-center">
                      🎉 <strong>7 dias grátis</strong> em qualquer plano. Cancele quando quiser.
                    </p>
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Criando conta...
                      </div>
                    ) : (
                      <>
                        Criar conta e começar <Sparkles size={18} />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Login link */}
              {step === 1 && (
                <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                  Já tem uma conta?{' '}
                  <button
                    onClick={() => { setView('login'); setErrors({}); }}
                    className="text-primary-500 hover:text-primary-600 font-semibold"
                  >
                    Entrar
                  </button>
                </p>
              )}
            </div>
          )}

          {/* ==================== FORGOT PASSWORD ==================== */}
          {view === 'forgot' && (
            <div>
              <button
                onClick={() => { setView('login'); setErrors({}); setForgotSent(false); }}
                className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-500 mb-6 transition-colors"
              >
                <ChevronLeft size={18} /> Voltar ao login
              </button>

              {!forgotSent ? (
                <>
                  <div className="mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                      <Lock size={28} className="text-primary-500" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                      Esqueceu a senha? 🔑
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Sem problemas! Digite seu email e enviaremos um link para redefinir sua senha.
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email cadastrado</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={e => { setForgotEmail(e.target.value); setErrors({}); }}
                        placeholder="seu@email.com"
                        className={inputClass('forgotEmail')}
                        onKeyDown={e => e.key === 'Enter' && handleForgotPassword()}
                      />
                    </div>
                    {renderInputError('forgotEmail')}
                  </div>

                  <button
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-lg shadow-primary-500/25 active:scale-[0.98]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </div>
                    ) : (
                      <>
                        Enviar link de recuperação
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-6">
                    <Mail size={36} className="text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                    Email enviado! ✉️
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                    Enviamos um link de recuperação para <strong className="text-slate-700 dark:text-slate-300">{forgotEmail}</strong>. Verifique sua caixa de entrada e spam.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 mb-6">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      O link expira em <strong>30 minutos</strong>. Caso não receba, tente novamente.
                    </p>
                  </div>
                  <button
                    onClick={() => { setForgotSent(false); setForgotEmail(''); }}
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                  >
                    Reenviar email
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ==================== VERIFY CODE ==================== */}
          {view === 'verify' && (
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
                <Shield size={36} className="text-primary-500" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Verificação de email 🔐
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                Enviamos um código de 6 dígitos para <strong className="text-slate-700 dark:text-slate-300">{regEmail}</strong>
              </p>

              {/* Code inputs */}
              <div className="flex justify-center gap-3 mb-8">
                {verifyCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`verify-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleVerifyCodeInput(i, e.target.value)}
                    onKeyDown={e => handleVerifyKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all ${
                      digit
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white'
                    } focus:ring-2 focus:ring-primary-500 focus:border-primary-500`}
                  />
                ))}
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || verifyCode.join('').length < 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-lg shadow-primary-500/25 active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verificando...
                  </div>
                ) : (
                  <>
                    Verificar e entrar
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-4">
                <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                  Reenviar código
                </button>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <button
                  onClick={() => { setView('register'); setStep(1); }}
                  className="text-sm text-slate-500 hover:text-slate-600 font-medium"
                >
                  Trocar email
                </button>
              </div>

              {/* Demo hint */}
              <div className="mt-6 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  💡 <strong>Demo:</strong> Digite qualquer 6 dígitos (ex: 123456)
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400 dark:text-slate-600">
              <button className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Termos</button>
              <span>•</span>
              <button className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Privacidade</button>
              <span>•</span>
              <button className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Suporte</button>
            </div>
            <p className="text-center text-[10px] text-slate-300 dark:text-slate-700 mt-2">
              © 2024 Odonto Pro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
