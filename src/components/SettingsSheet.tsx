import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

interface SettingsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showSpendingTab: boolean;
  onToggleSpendingTab: (checked: boolean) => void;
  onLogout: () => void;
}

export function SettingsSheet({ 
  open, 
  onOpenChange, 
  showSpendingTab, 
  onToggleSpendingTab,
  onLogout
}: SettingsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[400px] rounded-t-3xl">
        <SheetHeader className="text-left">
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your finance app experience
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm text-gray-500">Features</h3>
            
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex-1">
                <Label htmlFor="spending-tab" className="text-gray-800 cursor-pointer">
                  Spending Breakdown
                </Label>
                <p className="text-sm text-gray-500 mt-1">
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
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600">
                MoMo Press v1.0
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Track your MoMo spending and manage your finances
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
