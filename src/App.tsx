import { useState, useEffect } from 'react';
import { Receipt, Home, Send, TrendingDown, Settings } from 'lucide-react';
import { MoMoTransactionsScreen } from './components/MoMoTransactionsScreen';
import { MoMoOverviewScreen } from './components/MoMoOverviewScreen';
import { SendMoneyScreen } from './components/SendMoneyScreen';
import { SpendingScreen } from './components/SpendingScreen';
import { SettingsSheet } from './components/SettingsSheet';
import { BudgetLimitsSheet, BudgetLimits, CategorySettings } from './components/BudgetLimitsSheet';
import { LoginScreen } from './components/LoginScreen';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner@2.0.3';

type Screen = 'transactions' | 'overview' | 'spending' | 'send';

const STORAGE_KEY = 'finance-app-budget-limits';
const CATEGORY_SETTINGS_KEY = 'finance-app-category-settings';
const AUTH_KEY = 'momo-press-authenticated';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeScreen, setActiveScreen] = useState<Screen>('overview');
  const [showSettings, setShowSettings] = useState(false);
  const [showSpendingTab, setShowSpendingTab] = useState(true);
  const [showBudgetLimits, setShowBudgetLimits] = useState(false);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimits>({});
  const [categorySettings, setCategorySettings] = useState<{ [key: string]: CategorySettings }>({});
  const [hasShownAlerts, setHasShownAlerts] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem(AUTH_KEY);
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load budget limits and category settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setBudgetLimits(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load budget limits', e);
      }
    }
    
    const savedSettings = localStorage.getItem(CATEGORY_SETTINGS_KEY);
    if (savedSettings) {
      try {
        setCategorySettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to load category settings', e);
      }
    }
  }, []);

  // Check for budget violations and show alerts
  useEffect(() => {
    if (hasShownAlerts) return;

    const spendingData = [
      { id: 'transfers', name: 'Money Transfers', amount: 45000 },
      { id: 'airtime', name: 'Airtime & Data', amount: 15000 },
      { id: 'merchants', name: 'Merchant Payments', amount: 38000 },
      { id: 'utilities', name: 'Utilities & Bills', amount: 25000 },
      { id: 'cashout', name: 'Cash Out', amount: 8000 },
      { id: 'other', name: 'Other', amount: 3000 },
    ];

    const violations = spendingData.filter(
      item => budgetLimits[item.id] && item.amount > budgetLimits[item.id]
    );

    if (violations.length > 0) {
      violations.forEach(violation => {
        const overage = violation.amount - budgetLimits[violation.id];
        toast.error(`Budget Alert: ${violation.name}`, {
          description: `You've exceeded your limit by RWF ${overage.toLocaleString()}`,
          duration: 5000,
        });
      });
      setHasShownAlerts(true);
    }
  }, [budgetLimits, hasShownAlerts]);

  // If spending tab is disabled and we're on it, redirect to overview
  const handleToggleSpendingTab = (checked: boolean) => {
    setShowSpendingTab(checked);
    if (!checked && activeScreen === 'spending') {
      setActiveScreen('overview');
    }
  };

  const handleSaveBudgetLimits = (limits: BudgetLimits, settings: { [key: string]: CategorySettings }) => {
    setBudgetLimits(limits);
    setCategorySettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limits));
    localStorage.setItem(CATEGORY_SETTINGS_KEY, JSON.stringify(settings));
    setHasShownAlerts(false); // Reset alerts when limits are changed
    
    // Check for newly blocked categories
    const blockedCategories = Object.entries(settings)
      .filter(([_, setting]) => setting.blocked)
      .map(([id, _]) => {
        const categoryNames: { [key: string]: string } = {
          transfers: 'Money Transfers',
          airtime: 'Airtime & Data',
          merchants: 'Merchant Payments',
          utilities: 'Utilities & Bills',
          cashout: 'Cash Out',
          other: 'Other',
        };
        return categoryNames[id];
      });
    
    if (blockedCategories.length > 0) {
      toast.warning(`Categories blocked: ${blockedCategories.join(', ')}`, {
        description: 'Transactions in these categories will require emergency override',
      });
    } else {
      toast.success('Budget settings saved successfully');
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');
    toast.success('Welcome to MoMo Press!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    setShowSettings(false);
    toast.success('Logged out successfully');
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md h-[812px] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
        {/* Status Bar */}
        <div className="h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-20 h-6 bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-xs">MTN</span>
            </div>
          </div>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-yellow-500/50 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-900" />
          </button>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-auto">
          {activeScreen === 'transactions' && <MoMoTransactionsScreen />}
          {activeScreen === 'overview' && <MoMoOverviewScreen onSendMoney={() => setActiveScreen('send')} />}
          {activeScreen === 'spending' && (
            <SpendingScreen 
              budgetLimits={budgetLimits} 
              onOpenBudgetSettings={() => setShowBudgetLimits(true)}
            />
          )}
          {activeScreen === 'send' && <SendMoneyScreen categorySettings={categorySettings} />}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-gray-100 px-6 py-4 pb-6">
          <div className="flex items-center justify-around">
            <button
              onClick={() => setActiveScreen('overview')}
              className={`flex flex-col items-center gap-1 p-1 ${
                activeScreen === 'overview' ? 'text-yellow-500' : 'text-gray-400'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </button>
            <button
              onClick={() => setActiveScreen('send')}
              className={`flex flex-col items-center gap-1 p-1 ${
                activeScreen === 'send' ? 'text-yellow-500' : 'text-gray-400'
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="text-xs">Send</span>
            </button>
            {showSpendingTab && (
              <button
                onClick={() => setActiveScreen('spending')}
                className={`flex flex-col items-center gap-1 p-1 ${
                  activeScreen === 'spending' ? 'text-yellow-500' : 'text-gray-400'
                }`}
              >
                <TrendingDown className="w-5 h-5" />
                <span className="text-xs">Spending</span>
              </button>
            )}
            <button
              onClick={() => setActiveScreen('transactions')}
              className={`flex flex-col items-center gap-1 p-1 ${
                activeScreen === 'transactions' ? 'text-yellow-500' : 'text-gray-400'
              }`}
            >
              <Receipt className="w-5 h-5" />
              <span className="text-xs">History</span>
            </button>
          </div>
        </div>

        {/* Settings Sheet */}
        <SettingsSheet
          open={showSettings}
          onOpenChange={setShowSettings}
          showSpendingTab={showSpendingTab}
          onToggleSpendingTab={handleToggleSpendingTab}
          onLogout={handleLogout}
        />

        {/* Budget Limits Sheet */}
        <BudgetLimitsSheet
          open={showBudgetLimits}
          onOpenChange={setShowBudgetLimits}
          budgetLimits={budgetLimits}
          onSaveLimits={handleSaveBudgetLimits}
          categorySettings={categorySettings}
        />

        {/* Toast Notifications */}
        <Toaster position="top-center" />
      </div>
    </div>
  );
}
