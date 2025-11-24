// components/ClaimModal.tsx
import { useState, useEffect } from "react";
import { X, CheckCircle, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface ClaimModalProps {
  isOpen: boolean;
  onConfirm: (claimedByName: string, claimDate: string) => void;
  onCancel: () => void;
  itemTitle: string;
  itemDate?: string;
}

const ClaimModal = ({ isOpen, onConfirm, onCancel, itemTitle }: ClaimModalProps) => {
  const [claimedByName, setClaimedByName] = useState("");
  const [claimDate, setClaimDate] = useState(new Date().toISOString().split('T')[0]);

  // Get current year dates
  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const firstDayOfYear = new Date(currentYear, 0, 1).toISOString().split('T')[0]; // January 1st of current year

  const handleConfirm = () => {
    if (claimedByName.trim()) {
      onConfirm(claimedByName.trim(), claimDate);
      setClaimedByName("");
      setClaimDate(today);
    }
  };

  const handleCancel = () => {
    setClaimedByName("");
    setClaimDate(today);
    onCancel();
  };

  // Reset claim date when modal opens
  useEffect(() => {
    if (isOpen) {
      setClaimDate(today);
    }
  }, [isOpen, today]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-800 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Mark as Claimed
            </h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-zinc-600 dark:text-zinc-300">
            Who claimed <span className="font-semibold">"{itemTitle}"</span>?
          </p>

          <div className="space-y-2">
            <Label htmlFor="claimedBy">Claimed By</Label>
            <Input
              id="claimedBy"
              placeholder="Enter name of the person who claimed this item"
              value={claimedByName}
              onChange={(e) => setClaimedByName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && claimedByName.trim()) {
                  handleConfirm();
                }
              }}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="claimDate" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date Claimed
            </Label>
            <Input
              id="claimDate"
              type="date"
              value={claimDate}
              onChange={(e) => setClaimDate(e.target.value)}
              min={firstDayOfYear} // January 1st of current year
              max={today}          // Today's date
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Select a date from this year (January {currentYear} to today)
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!claimedByName.trim()}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Claimed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;