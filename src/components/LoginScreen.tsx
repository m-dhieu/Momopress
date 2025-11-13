import { useState } from 'react';
import { Eye, EyeOff, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in real app would verify credentials
    const hasCredential = loginMethod === 'phone' ? phoneNumber : email;
    if (hasCredential && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-yellow-500/20 to-orange-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-gradient-to-tr from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Curved decorative elements */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-20" viewBox="0 0 1440 800" preserveAspectRatio="none">
          <path
            d="M0,160 C320,300 520,100 720,200 C920,300 1120,100 1440,200 L1440,0 L0,0 Z"
            fill="url(#gradient1)"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50">
          {/* Logo/Branding */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
                <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-yellow-400 tracking-wider">MoMo</span>
                  <span className="text-white text-xs ml-1">Press</span>
                </div>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping opacity-75" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Sign in to manage your MoMo finances</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Login Method Toggle */}
            <div className="flex gap-2 p-1 bg-gray-800/50 rounded-xl">
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
                  loginMethod === 'phone'
                    ? 'bg-yellow-500 text-gray-900'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm">Phone</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
                  loginMethod === 'email'
                    ? 'bg-yellow-500 text-gray-900'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">Email</span>
              </button>
            </div>

            {/* Phone Number Input */}
            {loginMethod === 'phone' && (
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Phone Number</label>
                <Input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+250 78X XXX XXX"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl h-12"
                  required
                />
              </div>
            )}

            {/* Email Input */}
            {loginMethod === 'email' && (
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl h-12"
                  required
                />
              </div>
            )}

            {/* Password Input */}
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl h-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-gray-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                />
                <label htmlFor="remember" className="text-gray-400 text-sm cursor-pointer">
                  Remember me
                </label>
              </div>
              <button type="button" className="text-yellow-400 text-sm hover:text-yellow-300 transition-colors">
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 h-12 rounded-xl shadow-lg shadow-yellow-500/30 transition-all hover:shadow-yellow-500/50"
            >
              Sign In
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Need an account?{' '}
              <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
      </div>
    </div>
  );
}
