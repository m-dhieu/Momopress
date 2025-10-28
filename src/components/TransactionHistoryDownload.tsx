import { Download } from 'lucide-react';
import { Button } from './ui/button';

const transactions = [
  {
    id: 1,
    type: 'sent',
    recipient: 'John Mugisha',
    phone: '078XXXX123',
    amount: -5000,
    category: 'Transfer',
    time: 'Today, 2:30 PM',
    date: '2025-10-26',
    status: 'completed',
    transactionId: 'MPR2510260001',
  },
  {
    id: 2,
    type: 'received',
    recipient: 'Sarah Uwase',
    phone: '078XXXX456',
    amount: 15000,
    category: 'Transfer',
    time: 'Today, 11:20 AM',
    date: '2025-10-26',
    status: 'completed',
    transactionId: 'MPR2510260002',
  },
  {
    id: 3,
    type: 'sent',
    recipient: 'MTN Airtime',
    phone: '',
    amount: -1000,
    category: 'Airtime',
    time: 'Yesterday, 6:15 PM',
    date: '2025-10-25',
    status: 'completed',
    transactionId: 'MPR2510250003',
  },
  {
    id: 4,
    type: 'sent',
    recipient: 'Shoprite',
    phone: '180180',
    amount: -25000,
    category: 'Merchant',
    time: 'Yesterday, 3:45 PM',
    date: '2025-10-25',
    status: 'completed',
    transactionId: 'MPR2510250004',
  },
  {
    id: 5,
    type: 'sent',
    recipient: 'Electrogaz EUCL',
    phone: '150150',
    amount: -12000,
    category: 'Utility',
    time: '2 days ago',
    date: '2025-10-24',
    status: 'completed',
    transactionId: 'MPR2510240005',
  },
  {
    id: 6,
    type: 'received',
    recipient: 'James Nkusi',
    phone: '078XXXX789',
    amount: 30000,
    category: 'Transfer',
    time: '3 days ago',
    date: '2025-10-23',
    status: 'completed',
    transactionId: 'MPR2510230006',
  },
  {
    id: 7,
    type: 'sent',
    recipient: 'MTN Airtime',
    phone: '',
    amount: -2000,
    category: 'Airtime',
    time: '4 days ago',
    date: '2025-10-22',
    status: 'completed',
    transactionId: 'MPR2510220007',
  },
  {
    id: 8,
    type: 'sent',
    recipient: 'Simba Supermarket',
    phone: '180181',
    amount: -18500,
    category: 'Merchant',
    time: '5 days ago',
    date: '2025-10-21',
    status: 'completed',
    transactionId: 'MPR2510210008',
  },
];

export function TransactionHistoryDownload() {
  const handleDownload = () => {
    const totalReceived = transactions
      .filter(t => t.type === 'received')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
    const totalSent = transactions
      .filter(t => t.type === 'sent')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MoMo Press Transaction Statement</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      background: #f3f4f6;
      padding: 40px 20px;
      color: #1f2937;
    }
    
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
      padding: 40px;
      color: #1f2937;
    }
    
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 30px;
    }
    
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #1f2937;
    }
    
    .logo-subtitle {
      font-size: 14px;
      color: #374151;
      margin-top: 4px;
    }
    
    .statement-info {
      text-align: right;
    }
    
    .statement-info h1 {
      font-size: 24px;
      margin-bottom: 8px;
    }
    
    .statement-info p {
      font-size: 14px;
      color: #374151;
    }
    
    .account-info {
      background: rgba(0, 0, 0, 0.1);
      padding: 20px;
      border-radius: 8px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    
    .info-item {
      display: flex;
      flex-direction: column;
    }
    
    .info-label {
      font-size: 12px;
      color: #374151;
      margin-bottom: 4px;
    }
    
    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #1f2937;
    }
    
    .summary-section {
      padding: 30px 40px;
      background: #fef3c7;
      border-bottom: 3px solid #eab308;
    }
    
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      text-align: center;
    }
    
    .summary-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .summary-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 8px;
    }
    
    .summary-value {
      font-size: 24px;
      font-weight: bold;
    }
    
    .summary-value.positive {
      color: #10b981;
    }
    
    .summary-value.negative {
      color: #ef4444;
    }
    
    .summary-value.neutral {
      color: #1f2937;
    }
    
    .transactions-section {
      padding: 40px;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 20px;
      color: #1f2937;
      padding-bottom: 10px;
      border-bottom: 2px solid #eab308;
    }
    
    .transaction-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .transaction-table thead {
      background: #f9fafb;
    }
    
    .transaction-table th {
      text-align: left;
      padding: 12px;
      font-size: 13px;
      color: #6b7280;
      font-weight: 600;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .transaction-table td {
      padding: 16px 12px;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    
    .transaction-table tbody tr:hover {
      background: #fef3c7;
    }
    
    .transaction-id {
      font-family: 'Courier New', monospace;
      color: #6b7280;
      font-size: 12px;
    }
    
    .amount-sent {
      color: #ef4444;
      font-weight: 600;
    }
    
    .amount-received {
      color: #10b981;
      font-weight: 600;
    }
    
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-completed {
      background: #d1fae5;
      color: #065f46;
    }
    
    .category-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 11px;
      background: #fef3c7;
      color: #92400e;
      font-weight: 500;
    }
    
    .footer {
      padding: 30px 40px;
      background: #f9fafb;
      border-top: 2px solid #e5e7eb;
      text-align: center;
    }
    
    .footer p {
      font-size: 13px;
      color: #6b7280;
      margin-bottom: 8px;
    }
    
    .footer .important {
      font-weight: 600;
      color: #1f2937;
    }
    
    @media print {
      body {
        background: white;
        padding: 0;
      }
      
      .container {
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-top">
        <div>
          <div class="logo">MoMo Press</div>
          <div class="logo-subtitle">Mobile Money Management</div>
        </div>
        <div class="statement-info">
          <h1>Transaction Statement</h1>
          <p>Generated: ${new Date().toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p style="margin-top: 4px;">${new Date().toLocaleTimeString('en-RW')}</p>
        </div>
      </div>
      
      <div class="account-info">
        <div class="info-item">
          <span class="info-label">Account Name</span>
          <span class="info-value">MoMo Press User</span>
        </div>
        <div class="info-item">
          <span class="info-label">Account Number</span>
          <span class="info-value">078XXXXXXX</span>
        </div>
        <div class="info-item">
          <span class="info-label">Statement Period</span>
          <span class="info-value">Last 30 Days</span>
        </div>
        <div class="info-item">
          <span class="info-label">Total Transactions</span>
          <span class="info-value">${transactions.length}</span>
        </div>
      </div>
    </div>
    
    <div class="summary-section">
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-label">Total Received</div>
          <div class="summary-value positive">+ RWF ${totalReceived.toLocaleString()}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Total Sent</div>
          <div class="summary-value negative">- RWF ${totalSent.toLocaleString()}</div>
        </div>
        <div class="summary-card">
          <div class="summary-label">Net Balance</div>
          <div class="summary-value ${(totalReceived - totalSent) >= 0 ? 'positive' : 'negative'}">
            ${(totalReceived - totalSent) >= 0 ? '+' : ''} RWF ${Math.abs(totalReceived - totalSent).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
    
    <div class="transactions-section">
      <h2 class="section-title">Transaction History</h2>
      
      <table class="transaction-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${transactions.map(t => `
            <tr>
              <td class="transaction-id">${t.transactionId}</td>
              <td>
                <div>${t.date}</div>
                <div style="font-size: 12px; color: #6b7280;">${t.time}</div>
              </td>
              <td>
                <div style="font-weight: 500;">${t.recipient}</div>
                ${t.phone ? `<div style="font-size: 12px; color: #6b7280;">${t.phone}</div>` : ''}
              </td>
              <td><span class="category-badge">${t.category}</span></td>
              <td class="${t.type === 'received' ? 'amount-received' : 'amount-sent'}">
                ${t.type === 'received' ? '+' : '-'} RWF ${Math.abs(t.amount).toLocaleString()}
              </td>
              <td><span class="status-badge status-completed">Completed</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <div class="footer">
      <p class="important">This is a computer-generated statement and does not require a signature.</p>
      <p>For any queries or disputes, please contact MoMo Press Support</p>
      <p>Email: support@momopress.rw | Phone: *182# or call 100</p>
      <p style="margin-top: 15px;">MoMo Press - Powered by MTN Mobile Money Rwanda</p>
      <p style="font-size: 11px; color: #9ca3af; margin-top: 8px;">
        This statement is confidential and intended for the addressee only.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MoMo-Press-Statement-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="gap-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
    >
      <Download className="w-4 h-4" />
      Download Statement
    </Button>
  );
}
