import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Gift, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CouponDialogProps {
  isOpen: boolean;
  onClose: () => void;
  offerTitle: string;
  couponCode: string;
  redemptionInstructions: string;
  pointsDeducted: number;
  expiresAt?: string;
}

export function CouponDialog({
  isOpen,
  onClose,
  offerTitle,
  couponCode,
  redemptionInstructions,
  pointsDeducted,
  expiresAt,
}: CouponDialogProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    // Define fallback copy function
    const fallbackCopy = () => {
      const textArea = document.createElement("textarea");
      textArea.value = couponCode;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return true;
        }
        return false;
      } catch (err) {
        console.error("Fallback copy failed:", err);
        return false;
      } finally {
        textArea.remove();
      }
    };

    // Try modern Clipboard API first, with immediate fallback on any error
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(couponCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      } catch (error) {
        console.warn("Clipboard API blocked, using fallback:", error);
        // Fallback to legacy method
        if (!fallbackCopy()) {
          alert(`Please manually copy this code: ${couponCode}`);
        }
        return;
      }
    }

    // Use fallback for older browsers or unsecure contexts
    if (!fallbackCopy()) {
      alert(`Please manually copy this code: ${couponCode}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gradient-to-br from-eco-500 to-eco-600 rounded-full shadow-lg">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-bold text-eco-800 dark:text-eco-200">
            Reward Redeemed Successfully!
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            Your coupon code is ready to use
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Offer Details */}
          <div className="text-center p-4 bg-eco-50 dark:bg-eco-900/20 rounded-lg border border-eco-200 dark:border-eco-700">
            <h3 className="font-semibold text-eco-800 dark:text-eco-200 mb-2">
              {offerTitle}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-eco-600 dark:text-eco-400" />
              <span className="text-sm text-eco-600 dark:text-eco-400 font-medium">
                {pointsDeducted.toLocaleString()} points redeemed
              </span>
            </div>
          </div>

          {/* Coupon Code */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Coupon Code:
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-eco-300 dark:border-eco-600">
                <code className="text-lg font-mono font-bold text-eco-700 dark:text-eco-300 block text-center">
                  {couponCode}
                </code>
              </div>
              <Button
                onClick={copyToClipboard}
                size="lg"
                variant="outline"
                className={cn(
                  "transition-all duration-300",
                  copied
                    ? "bg-eco-500 text-white border-eco-500 hover:bg-eco-600"
                    : "hover:bg-eco-50 dark:hover:bg-eco-950/50",
                )}
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-eco-600 dark:text-eco-400 text-center animate-in fade-in-50">
                ✅ Copied to clipboard!
              </p>
            )}
          </div>

          {/* Instructions */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              How to redeem:
            </label>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                {redemptionInstructions}
              </p>
            </div>
          </div>

          {/* Expiration */}
          {expiresAt && (
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-800 dark:text-orange-200 text-center">
                ⏰ Expires on {new Date(expiresAt).toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button
              onClick={() => {
                copyToClipboard();
                // You could also open the partner website here
              }}
              className="flex-1 bg-gradient-to-r from-eco-500 to-eco-600 hover:from-eco-600 hover:to-eco-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Copy & Shop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
