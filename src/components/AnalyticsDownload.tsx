import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { BudgetLimits } from './BudgetLimitsSheet';

const spendingCategories = [
  { id: 'transfers', name: 'Money Transfers', amount: 45000, percentage: 35, color: '#eab308', shortName: 'Transfers' },
  { id: 'airtime', name: 'Airtime & Data', amount: 15000, percentage: 12, color: '#f59e0b', shortName: 'Airtime' },
  { id: 'merchants', name: 'Merchant Payments', amount: 38000, percentage: 30, color: '#fbbf24', shortName: 'Merchants' },
  { id: 'utilities', name: 'Utilities & Bills', amount: 25000, percentage: 20, color: '#10b981', shortName: 'Utilities' },
  { id: 'cashout', name: 'Cash Out', amount: 8000, percentage: 6, color: '#6b7280', shortName: 'Cash Out' },
  { id: 'other', name: 'Other', amount: 3000, percentage: 2, color: '#9ca3af', shortName: 'Other' },
];

// Weekly trend data (last 4 weeks)
const weeklyTrend = [
  { week: 'Week 1', amount: 28000 },
  { week: 'Week 2', amount: 35000 },
  { week: 'Week 3', amount: 31000 },
  { week: 'Week 4', amount: 40000 },
];

interface AnalyticsDownloadProps {
  budgetLimits: BudgetLimits;
}

export function AnalyticsDownload({ budgetLimits }: AnalyticsDownloadProps) {
  const totalSpent = spendingCategories.reduce((sum, cat) => sum + cat.amount, 0);
  
  const handleDownload = async () => {
    // Create a temporary container for rendering charts
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    document.body.appendChild(container);

    // Generate chart images
    const pieChartSvg = await generatePieChart(container);
    const barChartSvg = await generateBarChart(container);
    const lineChartSvg = await generateLineChart(container);

    // Clean up container
    document.body.removeChild(container);

    // Generate HTML report with embedded charts
    const htmlContent = generateHTMLReport(pieChartSvg, barChartSvg, lineChartSvg);

    // Create and download the file
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MoMo-Analytics-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePieChart = (container: HTMLElement): Promise<string> => {
    return new Promise((resolve) => {
      const chartContainer = document.createElement('div');
      chartContainer.style.width = '400px';
      chartContainer.style.height = '400px';
      container.appendChild(chartContainer);

      // We'll generate an SVG data URL representation
      const svgData = `
        <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
            </filter>
          </defs>
          ${generatePieSlices()}
          <circle cx="200" cy="200" r="80" fill="white"/>
          <text x="200" y="190" text-anchor="middle" fill="#666" font-size="14">Total Spent</text>
          <text x="200" y="215" text-anchor="middle" fill="#333" font-size="20" font-weight="bold">RWF ${(totalSpent / 1000).toFixed(0)}k</text>
        </svg>
      `;
      
      resolve(svgData);
    });
  };

  const generatePieSlices = () => {
    let startAngle = 0;
    return spendingCategories.map(cat => {
      const angle = (cat.percentage / 100) * 360;
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
      return `<path d="${path}" fill="${cat.color}" filter="url(#shadow)"/>`;
    }).join('');
  };

  const generateBarChart = (container: HTMLElement): Promise<string> => {
    return new Promise((resolve) => {
      const maxAmount = Math.max(...spendingCategories.map(c => c.amount));
      const barWidth = 80;
      const spacing = 20;
      const chartHeight = 300;
      const chartWidth = (barWidth + spacing) * spendingCategories.length + 100;
      
      const bars = spendingCategories.map((cat, index) => {
        const height = (cat.amount / maxAmount) * (chartHeight - 80);
        const x = 60 + index * (barWidth + spacing);
        const y = chartHeight - height - 40;
        
        return `
          <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="${cat.color}" rx="4"/>
          <text x="${x + barWidth / 2}" y="${chartHeight - 20}" text-anchor="middle" fill="#666" font-size="12">${cat.shortName}</text>
          <text x="${x + barWidth / 2}" y="${y - 5}" text-anchor="middle" fill="#333" font-size="11">${(cat.amount / 1000).toFixed(0)}k</text>
        `;
      }).join('');
      
      const svgData = `
        <svg width="${chartWidth}" height="${chartHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="barShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.2"/>
            </filter>
          </defs>
          <line x1="50" y1="20" x2="50" y2="${chartHeight - 40}" stroke="#ddd" stroke-width="1"/>
          <line x1="50" y1="${chartHeight - 40}" x2="${chartWidth - 20}" y2="${chartHeight - 40}" stroke="#ddd" stroke-width="1"/>
          ${bars}
          <text x="25" y="15" fill="#666" font-size="12">RWF</text>
        </svg>
      `;
      
      resolve(svgData);
    });
  };

  const generateLineChart = (container: HTMLElement): Promise<string> => {
    return new Promise((resolve) => {
      const chartWidth = 600;
      const chartHeight = 250;
      const padding = 60;
      const maxAmount = Math.max(...weeklyTrend.map(w => w.amount));
      
      const points = weeklyTrend.map((week, index) => {
        const x = padding + (index / (weeklyTrend.length - 1)) * (chartWidth - padding * 2);
        const y = chartHeight - padding - ((week.amount / maxAmount) * (chartHeight - padding * 2));
        return { x, y, week, amount: week.amount };
      });
      
      const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      
      const areaPath = `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;
      
      const svgData = `
        <svg width="${chartWidth}" height="${chartHeight}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#eab308" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#eab308" stop-opacity="0.05"/>
            </linearGradient>
          </defs>
          
          <!-- Grid lines -->
          ${[0, 1, 2, 3, 4].map(i => {
            const y = padding + (i / 4) * (chartHeight - padding * 2);
            return `<line x1="${padding}" y1="${y}" x2="${chartWidth - padding}" y2="${y}" stroke="#f0f0f0" stroke-width="1"/>`;
          }).join('')}
          
          <!-- Area -->
          <path d="${areaPath}" fill="url(#lineGradient)"/>
          
          <!-- Line -->
          <path d="${pathData}" stroke="#eab308" stroke-width="3" fill="none"/>
          
          <!-- Points -->
          ${points.map(p => `
            <circle cx="${p.x}" cy="${p.y}" r="5" fill="white" stroke="#eab308" stroke-width="2"/>
            <text x="${p.x}" y="${chartHeight - 30}" text-anchor="middle" fill="#666" font-size="12">${p.week}</text>
            <text x="${p.x}" y="${p.y - 15}" text-anchor="middle" fill="#333" font-size="11">${(p.amount / 1000).toFixed(0)}k</text>
          `).join('')}
          
          <!-- Axes -->
          <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${chartHeight - padding}" stroke="#ddd" stroke-width="2"/>
          <line x1="${padding}" y1="${chartHeight - padding}" x2="${chartWidth - padding}" y2="${chartHeight - padding}" stroke="#ddd" stroke-width="2"/>
        </svg>
      `;
      
      resolve(svgData);
    });
  };

  const generateHTMLReport = (pieChart: string, barChart: string, lineChart: string) => {
    const categoriesExceedingLimit = spendingCategories.filter(
      cat => budgetLimits[cat.id] && cat.amount > budgetLimits[cat.id]
    );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MoMo Press Analytics Report</title>
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
    
    .category-list {
      display: grid;
      gap: 16px;
    }
    
    .category-item {
      background: #f9fafb;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-left: 4px solid;
    }
    
    .category-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
    }
    
    .category-details h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .category-details p {
      font-size: 14px;
      color: #6b7280;
    }
    
    .category-amount {
      text-align: right;
    }
    
    .category-amount .amount {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .category-amount .percentage {
      font-size: 14px;
      color: #6b7280;
    }
    
    .alert {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      gap: 12px;
    }
    
    .alert-icon {
      color: #dc2626;
      font-size: 20px;
    }
    
    .alert-content h4 {
      color: #dc2626;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .alert-content p {
      color: #991b1b;
      font-size: 14px;
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
      <h1>📊 MoMo Press Analytics</h1>
      <p>Monthly Spending Report - ${new Date().toLocaleDateString('en-RW', { month: 'long', year: 'numeric' })}</p>
      <p style="margin-top: 8px; font-size: 14px;">Generated on ${new Date().toLocaleDateString('en-RW', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
    </div>
    
    <div class="content">
      ${categoriesExceedingLimit.length > 0 ? `
      <div class="alert">
        <div class="alert-icon">⚠️</div>
        <div class="alert-content">
          <h4>Budget Alert!</h4>
          <p>You've exceeded your budget in ${categoriesExceedingLimit.length} ${categoriesExceedingLimit.length === 1 ? 'category' : 'categories'}: ${categoriesExceedingLimit.map(c => c.name).join(', ')}</p>
        </div>
      </div>
      ` : ''}
      
      <div class="summary-cards">
        <div class="card">
          <h3>Total Spent</h3>
          <div class="value">RWF ${totalSpent.toLocaleString()}</div>
          <div class="subvalue">This month</div>
        </div>
        
        <div class="card">
          <h3>Transactions</h3>
          <div class="value">${spendingCategories.length}</div>
          <div class="subvalue">Categories tracked</div>
        </div>
        
        <div class="card">
          <h3>Top Category</h3>
          <div class="value">${spendingCategories[0].percentage}%</div>
          <div class="subvalue">${spendingCategories[0].name}</div>
        </div>
        
        <div class="card">
          <h3>Average Weekly</h3>
          <div class="value">RWF ${(totalSpent / 4).toLocaleString()}</div>
          <div class="subvalue">~4 weeks</div>
        </div>
      </div>
      
      <div class="section">
        <h2>Spending Distribution</h2>
        <div class="chart-container">
          ${pieChart}
        </div>
      </div>
      
      <div class="section">
        <h2>Category Breakdown</h2>
        <div class="chart-container">
          ${barChart}
        </div>
      </div>
      
      <div class="section">
        <h2>Weekly Trend</h2>
        <div class="chart-container">
          ${lineChart}
        </div>
      </div>
      
      <div class="section">
        <h2>Category Details</h2>
        <div class="category-list">
          ${spendingCategories.map(cat => {
            const limit = budgetLimits[cat.id];
            const isOverLimit = limit && cat.amount > limit;
            return `
            <div class="category-item" style="border-left-color: ${cat.color};">
              <div class="category-info">
                <div class="category-icon" style="background-color: ${cat.color};">
                  ${cat.name.charAt(0)}
                </div>
                <div class="category-details">
                  <h4>${cat.name} ${isOverLimit ? '⚠️' : ''}</h4>
                  <p>${cat.percentage}% of total spending${limit ? ` • Budget: RWF ${limit.toLocaleString()}` : ''}</p>
                  ${isOverLimit ? `<p style="color: #dc2626; font-weight: 600;">Over budget by RWF ${(cat.amount - limit).toLocaleString()}</p>` : ''}
                </div>
              </div>
              <div class="category-amount">
                <div class="amount" style="color: ${isOverLimit ? '#dc2626' : '#1f2937'};">RWF ${cat.amount.toLocaleString()}</div>
                <div class="percentage">${cat.percentage}%</div>
              </div>
            </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p><strong>MoMo Press</strong> - Your Mobile Money Management Assistant</p>
      <p style="margin-top: 8px;">This report is generated automatically based on your transaction history.</p>
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
      Download Analytics
    </Button>
  );
}
