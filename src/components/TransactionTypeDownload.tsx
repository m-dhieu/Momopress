import { Download } from 'lucide-react';
import { Button } from './ui/button';

// Transaction type categorization
const transactionTypes = [
  { 
    id: 'phone-transfer', 
    name: 'Phone Transfers', 
    amount: 45000, 
    count: 12,
    percentage: 35, 
    color: '#eab308',
    description: 'Direct transfers to phone numbers'
  },
  { 
    id: 'airtime', 
    name: 'Airtime & Data', 
    amount: 15000, 
    count: 8,
    percentage: 12, 
    color: '#f59e0b',
    description: 'Mobile airtime and data bundles'
  },
  { 
    id: 'merchant-code', 
    name: 'Merchant Code Payments', 
    amount: 38000, 
    count: 15,
    percentage: 30, 
    color: '#fbbf24',
    description: 'Payments to merchants via code'
  },
  { 
    id: 'bank-transfer', 
    name: 'Bank Transfers', 
    amount: 20000, 
    count: 5,
    percentage: 16, 
    color: '#10b981',
    description: 'Transfers to bank accounts'
  },
  { 
    id: 'utility-code', 
    name: 'Utility Code Payments', 
    amount: 12000, 
    count: 6,
    percentage: 9, 
    color: '#6366f1',
    description: 'Utility bills via code'
  },
  { 
    id: 'other', 
    name: 'Other Transactions', 
    amount: 8000, 
    count: 4,
    percentage: 6, 
    color: '#9ca3af',
    description: 'Other transaction types'
  },
];

export function TransactionTypeDownload() {
  const totalAmount = transactionTypes.reduce((sum, type) => sum + type.amount, 0);
  const totalCount = transactionTypes.reduce((sum, type) => sum + type.count, 0);

  const handleDownload = async () => {
    // Generate pie chart SVG
    const pieChartSvg = generatePieChart();
    const barChartSvg = generateBarChart();
    
    // Generate HTML report
    const htmlContent = generateHTMLReport(pieChartSvg, barChartSvg);

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MoMo-Transaction-Types-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePieChart = (): string => {
    let startAngle = 0;
    const slices = transactionTypes.map(type => {
      const angle = (type.percentage / 100) * 360;
      const endAngle = startAngle + angle;
      const largeArc = angle > 180 ? 1 : 0;
      
      const x1 = 200 + 120 * Math.cos((startAngle - 90) * Math.PI / 180);
      const y1 = 200 + 120 * Math.sin((startAngle - 90) * Math.PI / 180);
      const x2 = 200 + 120 * Math.cos((endAngle - 90) * Math.PI / 180);
      const y2 = 200 + 120 * Math.sin((endAngle - 90) * Math.PI / 180);
      
      const x1Inner = 200 + 80 * Math.cos((startAngle - 90) * Math.PI / 180);
      const y1Inner = 200 + 80 * Math.sin((startAngle - 90) * Math.PI / 180);
      const x2Inner = 200 + 80 * Math.cos((endAngle - 90) * Math.PI / 180);
      const y2Inner = 200 + 80 * Math.sin((endAngle - 90) * Math.PI / 180);
      
      const path = `
        M ${x1Inner} ${y1Inner}
        L ${x1} ${y1}
        A 120 120 0 ${largeArc} 1 ${x2} ${y2}
        L ${x2Inner} ${y2Inner}
        A 80 80 0 ${largeArc} 0 ${x1Inner} ${y1Inner}
        Z
      `;
      
      startAngle = endAngle;
      return `<path d="${path}" fill="${type.color}" filter="url(#shadow)"/>`;
    }).join('');

    return `
      <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
          </filter>
        </defs>
        ${slices}
        <circle cx="200" cy="200" r="80" fill="white"/>
        <text x="200" y="190" text-anchor="middle" fill="#666" font-size="14">Total Amount</text>
        <text x="200" y="215" text-anchor="middle" fill="#333" font-size="20" font-weight="bold">RWF ${(totalAmount / 1000).toFixed(0)}k</text>
      </svg>
    `;
  };

  const generateBarChart = (): string => {
    const maxAmount = Math.max(...transactionTypes.map(t => t.amount));
    const barWidth = 80;
    const spacing = 20;
    const chartHeight = 300;
    const chartWidth = (barWidth + spacing) * transactionTypes.length + 100;
    
    const bars = transactionTypes.map((type, index) => {
      const height = (type.amount / maxAmount) * (chartHeight - 80);
      const x = 60 + index * (barWidth + spacing);
      const y = chartHeight - height - 40;
      
      return `
        <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${type.color}" rx="4"/>
        <text x="${x + barWidth / 2}" y="${chartHeight - 20}" text-anchor="middle" fill="#666" font-size="11">${type.name.split(' ')[0]}</text>
        <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" fill="#333" font-size="11">${type.count} txns</text>
      `;
    }).join('');
    
    return `
      <svg width="${chartWidth}" height="${chartHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="barShadow">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.2"/>
          </filter>
        </defs>
        <line x1="50" y1="20" x2="50" y2="${chartHeight - 40}" stroke="#ddd" stroke-width="1"/>
        <line x1="50" y1="${chartHeight - 40}" x2="${chartWidth - 20}" y2="${chartHeight - 40}" stroke="#ddd" stroke-width="1"/>
        ${bars}
        <text x="25" y="15" fill="#666" font-size="12">Count</text>
      </svg>
    `;
  };

  const generateHTMLReport = (pieChart: string, barChart: string): string => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MoMo Press - Transaction Types Report</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #fef3c7 0%, #f3f4f6 100%);
      padding: 40px 20px;
      color: #1f2937;
    }
    
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #eab308 0%, #f59e0b 100%);
      padding: 40px;
      text-align: center;
      color: #1f2937;
    }
    
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .card {
      background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
      padding: 24px;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .card h3 {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    .card .value {
      font-size: 28px;
      font-weight: 700;
      color: #1f2937;
    }
    
    .card .subvalue {
      font-size: 14px;
      color: #9ca3af;
      margin-top: 4px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 20px;
      color: #1f2937;
      padding-bottom: 12px;
      border-bottom: 3px solid #eab308;
    }
    
    .chart-container {
      background: #f9fafb;
      padding: 30px;
      border-radius: 16px;
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .type-list {
      display: grid;
      gap: 16px;
    }
    
    .type-item {
      background: #f9fafb;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-left: 4px solid;
    }
    
    .type-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .type-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
      font-size: 20px;
    }
    
    .type-details h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .type-details p {
      font-size: 14px;
      color: #6b7280;
    }
    
    .type-amount {
      text-align: right;
    }
    
    .type-amount .amount {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .type-amount .count {
      font-size: 14px;
      color: #6b7280;
    }
    
    .footer {
      background: #f9fafb;
      padding: 24px 40px;
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      border-top: 1px solid #e5e7eb;
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
      <h1>📊 Transaction Types Report</h1>
      <p>Detailed Breakdown by Transaction Type</p>
      <p style="margin-top: 8px; font-size: 14px;">Generated on ${new Date().toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    
    <div class="content">
      <div class="summary-cards">
        <div class="card">
          <h3>Total Amount</h3>
          <div class="value">RWF ${totalAmount.toLocaleString()}</div>
          <div class="subvalue">All transactions</div>
        </div>
        
        <div class="card">
          <h3>Total Transactions</h3>
          <div class="value">${totalCount}</div>
          <div class="subvalue">This period</div>
        </div>
        
        <div class="card">
          <h3>Transaction Types</h3>
          <div class="value">${transactionTypes.length}</div>
          <div class="subvalue">Categories</div>
        </div>
        
        <div class="card">
          <h3>Average per Type</h3>
          <div class="value">RWF ${Math.round(totalAmount / transactionTypes.length).toLocaleString()}</div>
          <div class="subvalue">Mean amount</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Transaction Type Distribution</h2>
        <div class="chart-container">
          ${pieChart}
        </div>
      </div>
      
      <div class="section">
        <h2>Transaction Count by Type</h2>
        <div class="chart-container">
          ${barChart}
        </div>
      </div>
      
      <div class="section">
        <h2>Detailed Breakdown</h2>
        <div class="type-list">
          ${transactionTypes.map(type => `
          <div class="type-item" style="border-left-color: ${type.color};">
            <div class="type-info">
              <div class="type-icon" style="background-color: ${type.color};">
                ${type.name.split(' ').map(w => w[0]).join('').substring(0, 2)}
              </div>
              <div class="type-details">
                <h4>${type.name}</h4>
                <p>${type.description}</p>
                <p style="margin-top: 4px; color: #374151; font-weight: 500;">${type.percentage}% of total amount</p>
              </div>
            </div>
            <div class="type-amount">
              <div class="amount">RWF ${type.amount.toLocaleString()}</div>
              <div class="count">${type.count} transactions</div>
            </div>
          </div>
          `).join('')}
        </div>
      </div>
      
      <div class="section">
        <h2>Insights</h2>
        <div class="card">
          <h3 style="color: #1f2937; font-size: 16px; margin-bottom: 12px;">Key Observations</h3>
          <ul style="list-style: none; padding: 0;">
            <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <strong>Most Used:</strong> ${transactionTypes.reduce((max, type) => type.count > max.count ? type : max).name} with ${transactionTypes.reduce((max, type) => type.count > max.count ? type : max).count} transactions
            </li>
            <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
              <strong>Highest Amount:</strong> ${transactionTypes.reduce((max, type) => type.amount > max.amount ? type : max).name} at RWF ${transactionTypes.reduce((max, type) => type.amount > max.amount ? type : max).amount.toLocaleString()}
            </li>
            <li style="padding: 8px 0;">
              <strong>Average Transaction:</strong> RWF ${Math.round(totalAmount / totalCount).toLocaleString()} per transaction
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>MoMo Press</strong> - Your Mobile Money Management Assistant</p>
      <p style="margin-top: 8px;">Transaction type analytics help you understand your spending patterns.</p>
    </div>
  </div>
</body>
</html>
    `;
  };

  return (
    <Button
      onClick={handleDownload}
      variant="outline"
      className="gap-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
    >
      <Download className="w-4 h-4" />
      Transaction Types
    </Button>
  );
}
