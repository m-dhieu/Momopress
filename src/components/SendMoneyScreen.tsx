import { useState } from 'react';
import { Phone, Hash, ArrowRight, Clock, AlertTriangle, MessageSquare, HelpCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { TransactionReceipt } from './TransactionReceipt';
import { CategorySettings } from './BudgetLimitsSheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';

const recentContacts = [
  { name: 'John Mugisha', phone: '078XXXX123', type: 'Contact' },
  { name: 'Sarah Uwase', phone: '078XXXX456', type: 'Contact' },
  { name: 'Shoprite', code: '180180', type: 'Merchant' },
  { name: 'Electrogaz', code: '150150', type: 'Utility' },
];

const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

interface SendMoneyScreenProps {
  categorySettings?: { [key: string]: CategorySettings };
  enableTransactionMessages?: boolean;
  enableWeeklyCheck?: boolean;
  darkMode?: boolean;
}

export function SendMoneyScreen({ 
  categorySettings = {}, 
  enableTransactionMessages = false,
  enableWeeklyCheck = false,
  darkMode = false
}: SendMoneyScreenProps) {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isPhoneNumber, setIsPhoneNumber] = useState(true);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [showBlockedDialog, setShowBlockedDialog] = useState(false);
  const [blockedCategory, setBlockedCategory] = useState<string>('');
  const [emergencyPlan, setEmergencyPlan] = useState<string>('');
  const [showWeeklyCheckDialog, setShowWeeklyCheckDialog] = useState(false);

  const handleSend = () => {
    if (!recipient || !amount) {
      toast.error('Please enter both recipient and amount');
      return;
    }

    // Determine category based on recipient type
    let category = 'transfers';
    if (!isPhoneNumber) {
      category = 'merchants'; // Merchant code
    } else if (recipient.toLowerCase().includes('airtime') || recipient.toLowerCase().includes('mtn')) {
      category = 'airtime';
    }

    // Check if category is blocked
    if (categorySettings[category]?.blocked) {
      setBlockedCategory(category);
      setEmergencyPlan(categorySettings[category]?.emergencyPlan || '');
      setShowBlockedDialog(true);
      return;
    }

    // Check weekly average if enabled
    if (enableWeeklyCheck) {
      const weeklyAverage = calculateWeeklyAverage();
      if (parseInt(amount) > weeklyAverage) {
        setShowWeeklyCheckDialog(true);
        return;
      }
    }

    processTransaction();
  };

  const calculateWeeklyAverage = (): number => {
    // Calculate weekly average from stored transactions
    // For now, using a sample average
    const sampleWeeklyTransactions = [5000, 8000, 3000, 12000, 6000, 4000, 7000];
    const average = sampleWeeklyTransactions.reduce((sum, amt) => sum + amt, 0) / sampleWeeklyTransactions.length;
    return Math.round(average);
  };

  const processTransaction = () => {
    toast.loading('Processing transaction...', { id: 'send-money' });
    
    setTimeout(() => {
      const transactionId = `MPR${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
      const currentBalance = 487350; // Would be dynamic in real app
      
      const receipt = {
        recipient,
        amount: parseInt(amount),
        message: message || undefined,
        type: isPhoneNumber ? 'Money Transfer' : 'Merchant Payment',
        phone: isPhoneNumber ? recipient : undefined,
        transactionId,
        date: new Date().toLocaleDateString('en-RW', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: new Date().toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' }),
        balance: currentBalance - parseInt(amount),
      };

      // Store transaction with message in localStorage
      if (message) {
        const transactions = JSON.parse(localStorage.getItem('momo-transactions') || '[]');
        transactions.push({
          ...receipt,
          timestamp: Date.now()
        });
        localStorage.setItem('momo-transactions', JSON.stringify(transactions));
      }
      
      setReceiptData(receipt);
      setShowReceipt(true);
      
      toast.success('Transaction Successful!', {
        id: 'send-money',
        description: `RWF ${amount} sent to ${recipient}`,
        duration: 3000,
      });
      
      // Reset form
      setRecipient('');
      setAmount('');
      setMessage('');
    }, 2000);
  };

  return (
    <div className={`h-full flex flex-col p-6 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-950' : 'bg-gradient-to-b from-yellow-50 to-white'}`}>
      <div className="mb-8">
        <h1 className={`${darkMode ? 'text-gray-100' : 'text-gray-800'} mb-1`}>Send Money</h1>
        <p className="text-gray-400 text-sm">Quick & secure transfers</p>
      </div>

      {/* Transfer Type Selection */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setIsPhoneNumber(true)}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            isPhoneNumber
              ? 'bg-yellow-400 text-gray-900 shadow-md'
              : darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Phone Number</span>
        </button>
        <button
          onClick={() => setIsPhoneNumber(false)}
          className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
            !isPhoneNumber
              ? 'bg-yellow-400 text-gray-900 shadow-md'
              : darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Merchant Code</span>
        </button>
      </div>

      {/* Input Form */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-6 shadow-sm mb-6`}>
        <div className="mb-4">
          <label className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-2 block`}>
            {isPhoneNumber ? 'Phone Number' : 'Merchant Code'}
          </label>
          <Input
            type={isPhoneNumber ? 'tel' : 'text'}
            placeholder={isPhoneNumber ? '078XXXXXXX' : 'Enter code'}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className={`text-lg ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : ''}`}
          />
        </div>

        <div className="mb-4">
          <label className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-2 block`}>Amount (RWF)</label>
          <Input
            type="number"
            placeholder="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`text-lg ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : ''}`}
          />
        </div>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {quickAmounts.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt.toString())}
              className={`py-2 px-3 ${darkMode ? 'bg-gray-700 hover:bg-yellow-500/20' : 'bg-gray-100 hover:bg-yellow-100'} rounded-lg text-sm transition-colors ${darkMode ? 'text-gray-200' : ''}`}
            >
              {amt.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Transaction Message (if enabled) */}
        {enableTransactionMessages && (
          <div className={`mb-6 ${darkMode ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border rounded-xl p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-yellow-600" />
              <label className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>Add a note (optional)</label>
            </div>
            <Textarea
              placeholder="e.g., Lunch with friends, Monthly rent..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-yellow-300'} focus:border-yellow-500 resize-none`}
              rows={2}
            />
            <p className="text-xs text-gray-500 mt-2">
              This message is stored locally and won't appear in MoMo SMS
            </p>
          </div>
        )}

        <Button
          onClick={handleSend}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-6 rounded-full"
        >
          <span className="flex items-center justify-center gap-2">
            Send Money
            <ArrowRight className="w-5 h-5" />
          </span>
        </Button>
      </div>

      {/* Recent Contacts */}
      <div className="flex-1 overflow-auto">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gray-400" />
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>Recent</p>
        </div>

        <div className="space-y-2">
          {recentContacts.map((contact, index) => (
            <button
              key={index}
              onClick={() => setRecipient(contact.phone || contact.code || '')}
              className={`w-full ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} rounded-2xl p-4 shadow-sm flex items-center justify-between transition-colors`}
            >
              <div className="text-left">
                <p className={`${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{contact.name}</p>
                <p className="text-gray-400 text-sm">{contact.phone || contact.code}</p>
              </div>
              <div className={`${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'} rounded-full px-3 py-1`}>
                <span className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-gray-700'}`}>{contact.type}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Receipt */}
      {receiptData && (
        <TransactionReceipt
          open={showReceipt}
          onOpenChange={setShowReceipt}
          transaction={receiptData}
        />
      )}

      {/* Blocked Category Dialog */}
      <AlertDialog open={showBlockedDialog} onOpenChange={setShowBlockedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Transaction Blocked
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                This category has been blocked due to budget limits. Transactions in this category are currently disabled.
              </p>
              
              {emergencyPlan && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                  <p className="text-sm font-semibold text-yellow-900 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Emergency Plan:
                  </p>
                  <p className="text-sm text-yellow-800 whitespace-pre-wrap">{emergencyPlan}</p>
                </div>
              )}
              
              <p className="text-sm text-gray-600 mt-3">
                To enable transactions, go to Settings → Budget Limits and unblock this category.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={processTransaction}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              Process as Emergency
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Weekly Average Check Dialog */}
      <AlertDialog open={showWeeklyCheckDialog} onOpenChange={setShowWeeklyCheckDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-blue-600">
              <HelpCircle className="w-5 h-5" />
              Unusual Transaction Amount
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                We noticed this transaction (RWF {parseInt(amount || '0').toLocaleString()}) exceeds your weekly average spending of RWF {calculateWeeklyAverage().toLocaleString()}.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  💡 <strong>Is this expected?</strong> This inquiry helps you stay aware of unusual spending patterns.
                </p>
              </div>
              
              <p className="text-sm text-gray-600 mt-3">
                Would you like to proceed with this transaction?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowWeeklyCheckDialog(false)}>
              Review Amount
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowWeeklyCheckDialog(false);
                processTransaction();
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900"
            >
              Yes, Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
