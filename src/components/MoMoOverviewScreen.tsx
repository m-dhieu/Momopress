import { PieChart, Pie, Cell, BarChart, Bar, XAxis, ResponsiveContainer } from 'recharts';
import { Send, Download, Phone, Zap, ShoppingBag, MoreHorizontal } from 'lucide-react';

const spendingByCategory = [
  { name: 'Transfers', value: 35, color: '#eab308' },
  { name: 'Airtime', value: 15, color: '#f59e0b' },
  { name: 'Merchants', value: 30, color: '#fbbf24' },
  { name: 'Utilities', value: 20, color: '#fcd34d' },
];

const weeklyActivity = [
  { day: 'M', amount: 15000 },
  { day: 'T', amount: 25000 },
  { day: 'W', amount: 12000 },
  { day: 'T', amount: 32000 },
  { day: 'F', amount: 18000 },
  { day: 'S', amount: 22000 },
  { day: 'S', amount: 10000 },
];

const COLORS = ['#eab308', '#f59e0b', '#fbbf24', '#fcd34d'];

const quickActions = [
  { icon: Send, label: 'Send Money', color: 'bg-yellow-400' },
  { icon: Download, label: 'Cash Out', color: 'bg-orange-400' },
  { icon: Phone, label: 'Buy Airtime', color: 'bg-blue-400' },
  { icon: Zap, label: 'Pay Bill', color: 'bg-green-400' },
];

interface MoMoOverviewScreenProps {
  onSendMoney: () => void;
  darkMode?: boolean;
}

export function MoMoOverviewScreen({ onSendMoney, darkMode = false }: MoMoOverviewScreenProps) {
  const totalSpent = weeklyActivity.reduce((sum, day) => sum + day.amount, 0);

  return (
    <div className={`h-full flex flex-col p-6 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-950' : 'bg-gradient-to-b from-yellow-50 to-white'}`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>MoMo Press</h1>
          <p className="text-gray-400 text-sm">Welcome back!</p>
        </div>
        <button className="p-2">
          <MoreHorizontal className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-6 shadow-lg mb-6 text-gray-900">
        <p className="text-gray-800 text-sm mb-2">Available Balance</p>
        <p className="mb-4">RWF 487,350</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-700 mb-1">This Month</p>
            <p className="text-sm">-RWF {totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 rounded-full px-4 py-2">
            <span className="text-xs text-yellow-400">MTN MoMo</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={index === 0 ? onSendMoney : undefined}
              className={`flex flex-col items-center gap-2 p-3 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`${action.color} rounded-full p-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center leading-tight`}>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Spending Analytics */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-sm mb-6`}>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-4`}>Spending This Week</p>
        
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-28 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={48}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {spendingByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-400">Total</p>
              <p className={`text-sm ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{totalSpent / 1000}k</p>
            </div>
          </div>

          <div className="flex-1 ml-6 space-y-2">
            {spendingByCategory.map((cat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cat.name}</span>
                </div>
                <span className={`text-xs ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-32 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivity}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Bar dataKey="amount" fill="#eab308" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm text-center`}>
          <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>24</p>
          <p className="text-gray-400 text-xs">Transactions</p>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm text-center`}>
          <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>12</p>
          <p className="text-gray-400 text-xs">Sent</p>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm text-center`}>
          <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>12</p>
          <p className="text-gray-400 text-xs">Received</p>
        </div>
      </div>
    </div>
  );
}
