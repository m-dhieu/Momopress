import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { LogOut, Moon, Sun } from 'lucide-react';
import { TransactionTypeDownload } from './TransactionTypeDownload';

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showSpendingTab: boolean;
  onToggleSpendingTab: (checked: boolean) => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: (checked: boolean) => void;
  enableTransactionMessages?: boolean;
  enableWeeklyCheck?: boolean;
  monthlyLimit?: number;
}

export function SettingsSheet({ 
  open, 
  onOpenChange, 
  showSpendingTab, 
  onToggleSpendingTab,
  onLogout,
  darkMode,
  onToggleDarkMode
}: SettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[480px] rounded-t-3xl flex flex-col">
        <SheetHeader className="text-left">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your finance app experience
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm text-gray-500">Appearance</h3>
            
            <div className={`flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
              <div className="flex-1 flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-yellow-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
                <div>
                  <Label htmlFor="dark-mode" className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} cursor-pointer`}>
                    Dark Mode
                  </Label>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    Switch to dark theme
                  </p>
                </div>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={onToggleDarkMode}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm text-gray-500">Features</h3>
            
            <div className={`flex items-center justify-between ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
              <div className="flex-1">
                <Label htmlFor="spending-tab" className={`${darkMode ? 'text-gray-200' : 'text-gray-800'} cursor-pointer`}>
                  Spending Breakdown
                </Label>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                  Show detailed category spending analysis
                </p>
              </div>
              <Switch
                id="spending-tab"
                checked={showSpendingTab}
                onCheckedChange={onToggleSpendingTab}
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-sm text-gray-500">About</h3>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl p-4`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                MoMo Press v1.0
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Track your MoMo spending and manage your finances
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button - Always visible at bottom */}
        <div className={`pt-4 pb-2 border-t ${darkMode ? 'bg-gray-950' : 'bg-white'}`}>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full h-12 gap-2 border-2 border-red-500 text-red-600 hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
