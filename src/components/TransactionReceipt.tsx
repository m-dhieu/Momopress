import { Dialog, DialogContent } from './ui/dialog';
import { CheckCircle2, Download, Share2, X, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';

interface TransactionReceiptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: {
    recipient: string;
    amount: number;
    message?: string;
    type: string;
    phone?: string;
    transactionId: string;
    date: string;
    time: string;
    balance: number;
  };
}

export function TransactionReceipt({ open, onOpenChange, transaction }: TransactionReceiptProps) {
  const handleDownloadReceipt = () => {
    const receiptHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MoMo Press Receipt</title>
  <style>
    body {
      font-family: 'Courier New', monospace;
      max-width: 400px;
      margin: 20px auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .receipt {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      border: 2px dashed #eab308;
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #eab308;
      margin-bottom: 20px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #eab308;
      margin-bottom: 5px;
    }
    .success {
      text-align: center;
      color: #10b981;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .success-icon {
      font-size: 48px;
      color: #10b981;
      margin-bottom: 10px;
    }
    .detail {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px dashed #e5e7eb;
    }
    .detail:last-child {
      border-bottom: none;
    }
    .label {
      color: #6b7280;
      font-size: 14px;
    }
    .value {
      font-weight: bold;
      color: #1f2937;
      text-align: right;
    }
    .amount {
      font-size: 24px;
      color: #eab308;
      font-weight: bold;
      text-align: center;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #eab308;
      color: #6b7280;
      font-size: 12px;
    }
    .transaction-id {
      background: #fef3c7;
      padding: 10px;
      border-radius: 4px;
      margin: 15px 0;
      text-align: center;
      font-size: 12px;
      color: #92400e;
    }
    .message {
      background: #eff6ff;
      padding: 12px;
      border-radius: 6px;
      margin: 15px 0;
      border-left: 3px solid #3b82f6;
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <div class="logo">MoMo Press</div>
      <div style="font-size: 12px; color: #6b7280;">Mobile Money Management</div>
    </div>
    
    <div class="success-icon">✓</div>
    <div class="success">TRANSACTION SUCCESSFUL</div>
    
    <div class="amount">RWF ${transaction.amount.toLocaleString()}</div>
    
    <div style="margin: 20px 0;">
      <div class="detail">
        <span class="label">Recipient</span>
        <span class="value">${transaction.recipient}</span>
      </div>
      ${transaction.phone ? `
      <div class="detail">
        <span class="label">Phone Number</span>
        <span class="value">${transaction.phone}</span>
      </div>
      ` : ''}
      <div class="detail">
        <span class="label">Type</span>
        <span class="value">${transaction.type}</span>
      </div>
      <div class="detail">
        <span class="label">Date</span>
        <span class="value">${transaction.date}</span>
      </div>
      <div class="detail">
        <span class="label">Time</span>
        <span class="value">${transaction.time}</span>
      </div>
      <div class="detail">
        <span class="label">New Balance</span>
        <span class="value">RWF ${transaction.balance.toLocaleString()}</span>
      </div>
    </div>
    
    ${transaction.message ? `
    <div class="message">
      <div style="font-size: 12px; color: #6b7280; margin-bottom: 5px;">📝 Note:</div>
      <div style="color: #1f2937; font-size: 14px;">${transaction.message}</div>
    </div>
    ` : ''}
    
    <div class="transaction-id">
      <strong>Transaction ID:</strong><br>
      ${transaction.transactionId}
    </div>
    
    <div class="footer">
      <p>Thank you for using MoMo Press</p>
      <p>For support: *182# or call 100</p>
      <p style="margin-top: 10px;">Powered by MTN Mobile Money</p>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MoMo-Receipt-${transaction.transactionId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border-none p-0 gap-0">
        <div className="relative">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 p-6 rounded-t-xl">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 text-gray-900 hover:bg-yellow-600 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center text-gray-900">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-3 shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-xl mb-1">Transaction Successful!</h2>
              <p className="text-sm text-gray-800">Your money has been sent</p>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="p-6 bg-white">
            {/* Amount */}
            <div className="text-center mb-6 pb-6 border-b-2 border-dashed border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Amount Sent</p>
              <p className="text-yellow-600">RWF {transaction.amount.toLocaleString()}</p>
            </div>

            {/* Transaction Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-500">Recipient</span>
                <span className="text-gray-900">{transaction.recipient}</span>
              </div>
              
              {transaction.phone && (
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-500">Phone Number</span>
                  <span className="text-gray-900">{transaction.phone}</span>
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-500">Type</span>
                <span className="text-gray-900">{transaction.type}</span>
              </div>

              {transaction.message && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 my-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-800">Transaction Note:</span>
                  </div>
                  <p className="text-sm text-blue-900">{transaction.message}</p>
                </div>
              )}
              
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-500">Date & Time</span>
                <div className="text-right">
                  <div className="text-gray-900">{transaction.date}</div>
                  <div className="text-sm text-gray-500">{transaction.time}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-start pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-500">New Balance</span>
                <span className="text-gray-900">RWF {transaction.balance.toLocaleString()}</span>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-yellow-800 text-center mb-1">Transaction ID</p>
              <p className="text-sm text-yellow-900 text-center break-all">{transaction.transactionId}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownloadReceipt}
                variant="outline"
                className="flex-1 gap-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button
                onClick={() => onOpenChange(false)}
                className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900"
              >
                Done
              </Button>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-400">Thank you for using MoMo Press</p>
              <p className="text-xs text-gray-400 mt-1">Powered by MTN Mobile Money</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
