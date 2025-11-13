import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShoppingBag, Coffee, Car, Home, Zap, Phone, MoreHorizontal, AlertTriangle, Settings } from 'lucide-react';
import { BudgetLimits } from './BudgetLimitsSheet';
import { Alert, AlertDescription } from './ui/alert';
import { AnalyticsDownload } from './AnalyticsDownload';

const spendingCategories = [
  { id: 'transfers', name: 'Money Transfers', amount: 45000, percentage: 35, color: '#eab308', icon: ShoppingBag },
  { id: 'airtime', name: 'Airtime & Data', amount: 15000, percentage: 12, color: '#f59e0b', icon: Phone },
  { id: 'merchants', name: 'Merchant Payments', amount: 38000, percentage: 30, color: '#fbbf24', icon: ShoppingBag },
  { id: 'utilities', name: 'Utilities & Bills', amount: 25000, percentage: 20, color: '#10b981', icon: Zap },
  { id: 'cashout', name: 'Cash Out', amount: 8000, percentage: 6, color: '#6b7280', icon: Car },
  { id: 'other', name: 'Other', amount: 3000, percentage: 2, color: '#9ca3af', icon: MoreHorizontal },
];

const totalSpent = spendingCategories.reduce((sum, cat) => sum + cat.amount, 0);

interface SpendingScreenProps {
  budgetLimits: BudgetLimits;
  onOpenBudgetSettings: () => void;
  darkMode?: boolean;
}

export function SpendingScreen({ budgetLimits, onOpenBudgetSettings, darkMode = false }: SpendingScreenProps) {
  const categoriesExceedingLimit = spendingCategories.filter(
    cat => budgetLimits[cat.id] && cat.amount > budgetLimits[cat.id]
  );
  return (
    <div className={`h-full flex flex-col p-6 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-950' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>Spending Breakdown</h1>
          <p className="text-gray-400 text-sm">Where your money goes</p>
        </div>
        <div className="flex items-center gap-2">
          <AnalyticsDownload budgetLimits={budgetLimits} />
          <button 
            onClick={onOpenBudgetSettings}
            className={`p-2 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} rounded-full transition-colors`}
          >
            <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>

      {/* Budget Alerts */}
      {categoriesExceedingLimit.length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <span className="font-semibold">Budget Alert!</span> You've exceeded your limit in{' '}
            {categoriesExceedingLimit.length} {categoriesExceedingLimit.length === 1 ? 'category' : 'categories'}:{' '}
            {categoriesExceedingLimit.map(cat => cat.name).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Total Spent Card */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-6 shadow-lg mb-6 text-gray-900">
        <p className="text-gray-800 text-sm mb-2">Total Spent This Month</p>
        <p className="mb-1">RWF {totalSpent.toLocaleString()}</p>
        <p className="text-gray-800 text-sm">Track your MoMo spending</p>
        
        {/* Progress Bar */}
        <div className="mt-4 bg-gray-900/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gray-900 h-full rounded-full transition-all duration-500"
            style={{ width: `${(totalSpent / 200000) * 100}%` }}
          />
        </div>
      </div>

      {/* Donut Chart */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-sm mb-6`}>
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingCategories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {spendingCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-gray-400 text-xs mb-1">Total</p>
              <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'} text-sm`}>{(totalSpent / 1000).toFixed(0)}k</p>
            </div>
          </div>
        </div>

        {/* Category Legend */}
        <div className="grid grid-cols-2 gap-2">
          {spendingCategories.slice(0, 4).map((category) => (
            <div key={category.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-xs truncate`}>{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown List */}
      <div className="space-y-3 flex-1 overflow-auto">
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3`}>Category Details</p>
        
        {spendingCategories.map((category) => {
          const Icon = category.icon;
          const limit = budgetLimits[category.id];
          const isOverLimit = limit && category.amount > limit;
          const limitPercentage = limit ? (category.amount / limit) * 100 : 0;
          
          return (
            <div key={category.name} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm ${isOverLimit ? 'border-2 border-red-200' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="rounded-full p-2"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: category.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{category.name}</p>
                      {isOverLimit && <AlertTriangle className="w-4 h-4 text-red-500" />}
                    </div>
                    <p className="text-gray-400 text-xs">{category.percentage}% of spending</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'} ${isOverLimit ? 'text-red-600' : ''}`}>RWF {category.amount.toLocaleString()}</p>
                  {limit > 0 && (
                    <p className="text-gray-400 text-xs">of RWF {limit.toLocaleString()}</p>
                  )}
                </div>
              </div>
              
              {/* Progress bar for each category */}
              {limit > 0 ? (
                <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(limitPercentage, 100)}%`,
                      backgroundColor: isOverLimit ? '#ef4444' : category.color 
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: category.color 
                    }}
                  />
                </div>
              )}
              
              {isOverLimit && (
                <p className="text-red-500 text-xs mt-2">
                  RWF {(category.amount - limit).toLocaleString()} over budget
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
