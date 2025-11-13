import { ArrowUpRight, ArrowDownLeft, Phone, Zap, ShoppingBag, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { TransactionHistoryDownload } from './TransactionHistoryDownload';

const transactions = [
  {
    id: 1,
    type: 'sent',
    recipient: 'John Mugisha',
    phone: '078XXXX123',
    amount: -5000,
    category: 'Transfer',
    time: 'Today, 2:30 PM',
    status: 'completed',
  },
  {
    id: 2,
    type: 'received',
    recipient: 'Sarah Uwase',
    phone: '078XXXX456',
    amount: 15000,
    category: 'Transfer',
    time: 'Today, 11:20 AM',
    status: 'completed',
  },
  {
    id: 3,
    type: 'sent',
    recipient: 'MTN Airtime',
    phone: '',
    amount: -1000,
    category: 'Airtime',
    time: 'Yesterday, 6:15 PM',
    status: 'completed',
  },
  {
    id: 4,
    type: 'sent',
    recipient: 'Shoprite',
    phone: '180180',
    amount: -25000,
    category: 'Merchant',
    time: 'Yesterday, 3:45 PM',
    status: 'completed',
  },
  {
    id: 5,
    type: 'sent',
    recipient: 'Electrogaz EUCL',
    phone: '150150',
    amount: -12000,
    category: 'Utility',
    time: '2 days ago',
    status: 'completed',
  },
  {
    id: 6,
    type: 'received',
    recipient: 'James Nkusi',
    phone: '078XXXX789',
    amount: 30000,
    category: 'Transfer',
    time: '3 days ago',
    status: 'completed',
  },
  {
    id: 7,
    type: 'sent',
    recipient: 'MTN Airtime',
    phone: '',
    amount: -2000,
    category: 'Airtime',
    time: '4 days ago',
    status: 'completed',
  },
  {
    id: 8,
    type: 'sent',
    recipient: 'Simba Supermarket',
    phone: '180181',
    amount: -18500,
    category: 'Merchant',
    time: '5 days ago',
    status: 'completed',
  },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Airtime':
      return Phone;
    case 'Utility':
      return Zap;
    case 'Merchant':
      return ShoppingBag;
    default:
      return ArrowUpRight;
  }
};

export function MoMoTransactionsScreen({ darkMode = false }: { darkMode?: boolean }) {
  return (
    <div className={`h-full flex flex-col p-6 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-950' : 'bg-gradient-to-b from-yellow-50 to-white'}`}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className={`${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>Transactions</h1>
          <p className="text-gray-400 text-sm">All your MoMo Press activity</p>
        </div>
        <TransactionHistoryDownload />
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search transactions..."
            className={`pl-10 ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white'}`}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-green-100 rounded-full p-2">
              <ArrowDownLeft className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-gray-400 text-xs">Received</p>
          </div>
          <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>RWF 45,000</p>
        </div>
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-red-100 rounded-full p-2">
              <ArrowUpRight className="w-4 h-4 text-red-600" />
            </div>
            <p className="text-gray-400 text-xs">Sent</p>
          </div>
          <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>RWF 63,500</p>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-auto space-y-3">
        {transactions.map((transaction) => {
          const CategoryIcon = getCategoryIcon(transaction.category);
          const isReceived = transaction.type === 'received';
          
          return (
            <div key={transaction.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4 shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`rounded-full p-2 ${isReceived ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isReceived ? (
                      <ArrowDownLeft className="w-4 h-4 text-green-600" />
                    ) : (
                      <CategoryIcon className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{transaction.recipient}</p>
                    {transaction.phone && (
                      <p className="text-gray-400 text-xs">{transaction.phone}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${isReceived ? 'text-green-600' : darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {isReceived ? '+' : ''}RWF {Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <Badge variant="outline" className="text-xs mt-1 border-yellow-300 text-yellow-700">
                    {transaction.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-xs">{transaction.time}</p>
                <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                  Completed
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
