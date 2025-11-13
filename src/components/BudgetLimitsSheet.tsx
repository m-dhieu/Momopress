import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { ShoppingBag, Coffee, Car, Home, Zap, Phone, AlertTriangle, Shield } from 'lucide-react';
import { Textarea } from './ui/textarea';

export interface BudgetLimits {
  [key: string]: number;
}

export interface CategorySettings {
  blocked: boolean;
  emergencyPlan?: string;
}

interface BudgetLimitsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budgetLimits: BudgetLimits;
  onSaveLimits: (limits: BudgetLimits, categorySettings: { [key: string]: CategorySettings }) => void;
  categorySettings: { [key: string]: CategorySettings };
  darkMode?: boolean;
}

const categories = [
  { id: 'transfers', name: 'Money Transfers', icon: ShoppingBag, color: '#eab308' },
  { id: 'airtime', name: 'Airtime & Data', icon: Phone, color: '#f59e0b' },
  { id: 'merchants', name: 'Merchant Payments', icon: ShoppingBag, color: '#fbbf24' },
  { id: 'utilities', name: 'Utilities & Bills', icon: Zap, color: '#10b981' },
  { id: 'cashout', name: 'Cash Out', icon: Car, color: '#6b7280' },
  { id: 'other', name: 'Other', icon: Home, color: '#9ca3af' },
];

export function BudgetLimitsSheet({ 
  open, 
  onOpenChange, 
  budgetLimits, 
  onSaveLimits,
  categorySettings,
  darkMode = false
}: BudgetLimitsSheetProps) {
  const [tempLimits, setTempLimits] = React.useState<BudgetLimits>(budgetLimits);
  const [tempSettings, setTempSettings] = React.useState<{ [key: string]: CategorySettings }>(categorySettings);
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  React.useEffect(() => {
    setTempLimits(budgetLimits);
    setTempSettings(categorySettings);
  }, [budgetLimits, categorySettings, open]);

  const handleSave = () => {
    onSaveLimits(tempLimits, tempSettings);
    onOpenChange(false);
  };

  const handleLimitChange = (categoryId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setTempLimits(prev => ({ ...prev, [categoryId]: numValue }));
  };

  const handleBlockToggle = (categoryId: string, blocked: boolean) => {
    setTempSettings(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        blocked,
      }
    }));
  };

  const handleEmergencyPlanChange = (categoryId: string, plan: string) => {
    setTempSettings(prev => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        emergencyPlan: plan,
      }
    }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className={`h-[700px] rounded-t-3xl ${darkMode ? 'bg-gray-950' : ''}`}>
        <SheetHeader className="text-left">
          <SheetTitle className={darkMode ? 'text-gray-100' : ''}>Budget Limits & Controls</SheetTitle>
          <SheetDescription className={darkMode ? 'text-gray-400' : ''}>
            Set spending limits, block categories, and configure emergency plans
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-3 overflow-auto h-[520px]">
          {categories.map((category) => {
            const Icon = category.icon;
            const isBlocked = tempSettings[category.id]?.blocked || false;
            const isExpanded = expandedCategory === category.id;
            
            return (
              <div 
                key={category.id} 
                className={`rounded-xl p-4 border-2 ${
                  isBlocked ? 'bg-red-50 border-red-200' : darkMode ? 'bg-gray-800 border-transparent' : 'bg-gray-50 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="rounded-full p-2"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: category.color }} />
                    </div>
                    <div>
                      <Label htmlFor={category.id} className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                        {category.name}
                      </Label>
                      {isBlocked && (
                        <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3" />
                          Transactions blocked
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`block-${category.id}`} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Block
                    </Label>
                    <Switch
                      id={`block-${category.id}`}
                      checked={isBlocked}
                      onCheckedChange={(checked) => handleBlockToggle(category.id, checked)}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gray-500 text-sm">RWF</span>
                  <Input
                    id={category.id}
                    type="number"
                    min="0"
                    step="1000"
                    value={tempLimits[category.id] || ''}
                    onChange={(e) => handleLimitChange(category.id, e.target.value)}
                    placeholder="No limit"
                    className={`flex-1 ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-100' : ''}`}
                    disabled={isBlocked}
                  />
                  <span className="text-gray-400 text-sm">/ month</span>
                </div>
                
                {isBlocked && (
                  <div className="mt-3 pt-3 border-t border-red-200">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 mb-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Emergency Plan {isExpanded ? '▼' : '▶'}</span>
                    </button>
                    
                    {isExpanded && (
                      <div className="mt-2">
                        <Textarea
                          placeholder="Describe what to do in case of emergency (e.g., 'Call 100 for utility emergencies', 'Maximum emergency transfer: RWF 5,000')"
                          value={tempSettings[category.id]?.emergencyPlan || ''}
                          onChange={(e) => handleEmergencyPlanChange(category.id, e.target.value)}
                          className="text-sm min-h-20"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          This plan will be shown when emergency transactions are needed
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            onClick={handleSave}
          >
            Save Limits
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
