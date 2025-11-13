import { useState } from 'react';
import { CheckCircle2, MessageSquare, Bell, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface OnboardingScreenProps {
  onComplete: (settings: OnboardingSettings) => void;
}

export interface OnboardingSettings {
  enableTransactionMessages: boolean;
  monthlyLimit: number;
  enableWeeklyCheck: boolean;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState(1);
  const [enableMessages, setEnableMessages] = useState(true);
  const [monthlyLimit, setMonthlyLimit] = useState('500000');
  const [enableWeeklyCheck, setEnableWeeklyCheck] = useState(true);

  const handleComplete = () => {
    onComplete({
      enableTransactionMessages: enableMessages,
      monthlyLimit: parseInt(monthlyLimit) || 0,
      enableWeeklyCheck: enableWeeklyCheck,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-700/50">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-yellow-400 tracking-wider">MoMo</span>
                <span className="text-white text-xs ml-1">Press</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-white mb-2">Welcome to MoMo Press</h1>
            <p className="text-gray-400 text-sm">Let's personalize your experience</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all ${
                  s === step
                    ? 'w-8 bg-yellow-400'
                    : s < step
                    ? 'w-2 bg-yellow-600'
                    : 'w-2 bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Transaction Messages */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-yellow-400/20 rounded-full p-3">
                    <MessageSquare className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-2">Transaction Messages</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Add custom notes to your transactions for better tracking. Messages are stored locally and don't modify MoMo SMS.
                    </p>
                    <div className="flex items-center justify-between bg-gray-700/50 rounded-xl p-4">
                      <Label htmlFor="enable-messages" className="text-gray-300 cursor-pointer">
                        Enable custom messages
                      </Label>
                      <Switch
                        id="enable-messages"
                        checked={enableMessages}
                        onCheckedChange={setEnableMessages}
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 h-12 rounded-xl"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* Step 2: Monthly Limit */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-red-400/20 rounded-full p-3">
                    <Bell className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-2">Monthly Spending Limit</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Set a monthly spending cap. You'll receive an alert when you exceed this limit.
                    </p>
                    <div className="space-y-3">
                      <Label htmlFor="monthly-limit" className="text-gray-300">
                        Monthly Limit (RWF)
                      </Label>
                      <Input
                        id="monthly-limit"
                        type="number"
                        value={monthlyLimit}
                        onChange={(e) => setMonthlyLimit(e.target.value)}
                        placeholder="500000"
                        className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-yellow-500 focus:ring-yellow-500/20 rounded-xl h-12"
                      />
                      <p className="text-gray-500 text-xs">
                        Set to 0 to disable monthly limit alerts
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 h-12 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 h-12 rounded-xl"
                >
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Weekly Average Check */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-400/20 rounded-full p-3">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white mb-2">Weekly Spending Checks</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Get notified when a transaction exceeds your weekly average spending. Helps identify unusual activity.
                    </p>
                    <div className="flex items-center justify-between bg-gray-700/50 rounded-xl p-4">
                      <Label htmlFor="enable-weekly" className="text-gray-300 cursor-pointer">
                        Enable weekly checks
                      </Label>
                      <Switch
                        id="enable-weekly"
                        checked={enableWeeklyCheck}
                        onCheckedChange={setEnableWeeklyCheck}
                        className="data-[state=checked]:bg-yellow-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <p className="text-green-400 text-sm">You're all set!</p>
                    <p className="text-gray-400 text-xs mt-1">
                      You can change these settings anytime from the Settings menu.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 h-12 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={handleComplete}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 h-12 rounded-xl"
                >
                  Get Started
                  <CheckCircle2 className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
