import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { GraduationCap, Users, UserCog, Eye, EyeOff, BookOpen, Award, Calendar, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

export function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated && user) {
    const redirectPath = `/${user.role}`;
    return <Navigate to={redirectPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const success = await login(id, password, selectedRole);
      if (success) {
        navigate(`/${selectedRole}`);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      id: 'student' as UserRole,
      icon: GraduationCap,
      title: 'Student',
      description: 'View grades & apply for resits',
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      shadow: 'shadow-blue-500/25',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 'instructor' as UserRole,
      icon: Users,
      title: 'Instructor',
      description: 'Manage exams & grades',
      gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-500/25',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'secretary' as UserRole,
      icon: UserCog,
      title: 'Secretary',
      description: 'Admin & scheduling',
      gradient: 'from-violet-500 via-purple-600 to-purple-700',
      shadow: 'shadow-purple-500/25',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  const features = [
    { icon: BookOpen, text: 'Course Management' },
    { icon: Award, text: 'Grade Tracking' },
    { icon: Calendar, text: 'Exam Scheduling' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-50 to-purple-50 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-[50%] relative">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900" />

          {/* Animated mesh gradient overlay */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-500/30 via-transparent to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-500/30 via-transparent to-transparent" />
          </div>

          {/* Animated circles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 right-20 w-72 h-72 border border-white/10 rounded-full animate-[spin_30s_linear_infinite]" />
            <div className="absolute top-32 right-32 w-48 h-48 border border-white/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 border border-white/10 rounded-full animate-[spin_25s_linear_infinite]" />
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                style={{
                  top: `${20 + i * 15}%`,
                  left: `${10 + i * 12}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${2 + i * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-12 w-full">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                  <span className="text-white font-bold text-2xl">U</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-slate-900">
                  <Sparkles size={10} className="text-white" />
                </div>
              </div>
              <div>
                <span className="text-white text-2xl font-bold tracking-tight">Uskudar University</span>
                <p className="text-blue-300/80 text-sm font-medium">Excellence in Education</p>
              </div>
            </div>

            {/* Main content */}
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-blue-200 text-sm font-medium">2024-2025 Academic Year</span>
                </div>

                <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                  Resit Exam
                  <span className="block mt-2 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                    Management System
                  </span>
                </h1>

                <p className="text-lg text-blue-100/70 max-w-md leading-relaxed">
                  Streamline your academic journey with our comprehensive platform for managing resit examinations efficiently.
                </p>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-3 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className="group p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={20} className="text-blue-300" />
                      </div>
                      <span className="text-white/90 text-sm font-medium">{feature.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-blue-300/60 text-sm">
                <Shield size={16} />
                <span>Enterprise Security</span>
              </div>
              <div className="w-px h-4 bg-white/20" />
              <div className="flex items-center gap-2 text-blue-300/60 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-[440px]">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-10">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                    <span className="text-white font-bold text-2xl">U</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center border-2 border-white">
                    <Sparkles size={10} className="text-white" />
                  </div>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Uskudar University</h1>
              <p className="text-gray-500 text-sm">Resit Exam Management System</p>
            </div>

            {/* Login card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 sm:p-10 border border-slate-100/80">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-500">Select your role to sign in</p>
              </div>

              {/* Role selector */}
              <div className="space-y-3 mb-8">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">I am a...</p>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`
                          relative p-4 rounded-2xl transition-all duration-300 group overflow-hidden
                          ${isSelected
                            ? `bg-gradient-to-br ${role.gradient} shadow-xl ${role.shadow} scale-[1.02]`
                            : 'bg-slate-50 hover:bg-slate-100 border-2 border-slate-100 hover:border-slate-200'
                          }
                        `}
                      >
                        {/* Shimmer effect on selected */}
                        {isSelected && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        )}

                        <div className="relative flex flex-col items-center gap-2.5">
                          <div className={`
                            p-2.5 rounded-xl transition-all duration-300
                            ${isSelected
                              ? 'bg-white/20 shadow-inner'
                              : `${role.iconBg} group-hover:scale-110`
                            }
                          `}>
                            <Icon
                              size={22}
                              strokeWidth={2.5}
                              className={`transition-colors duration-300 ${
                                isSelected ? 'text-white' : role.iconColor
                              }`}
                            />
                          </div>
                          <span
                            className={`text-sm font-bold transition-colors duration-300 ${
                              isSelected ? 'text-white' : 'text-gray-700'
                            }`}
                          >
                            {role.title}
                          </span>
                        </div>

                        {/* Checkmark badge */}
                        {isSelected && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg animate-[pop_0.3s_ease-out]">
                            <svg
                              className="w-3.5 h-3.5 text-emerald-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Student / Staff ID
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Enter your ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-100 -z-10 blur transition-opacity duration-300" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3.5 pr-12 bg-slate-50 border-2 border-slate-100 rounded-xl text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-slate-200 rounded-md peer-checked:border-blue-500 peer-checked:bg-blue-500 transition-all duration-200" />
                      <svg
                        className="absolute top-0.5 left-0.5 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Error message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-[shake_0.5s_ease-in-out]">
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!selectedRole || isLoading}
                  className={`
                    relative w-full py-4 px-6 rounded-xl font-bold text-white text-base overflow-hidden
                    transition-all duration-300 transform
                    ${selectedRole
                      ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0'
                      : 'bg-slate-300 cursor-not-allowed'
                    }
                    disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                    group
                  `}
                >
                  {/* Button shine effect */}
                  {selectedRole && !isLoading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  )}

                  <span className="relative">
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Sign In
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    )}
                  </span>
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center space-y-3">
              <p className="text-sm text-gray-500">
                Need help?{' '}
                <a href="mailto:support@uskudar.edu.tr" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Contact IT Support
                </a>
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <Shield size={14} />
                <span>Protected by enterprise-grade security</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animations */}
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(200%); }
        }
        @keyframes pop {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}
