import React, { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/config/firebase";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Import the toast function

// --- Type Definitions ---

// Defines the props the TradeModal component will accept.
interface TradeModalProps {
  competitionId: string;
  symbol: string;
  assetType: "stock" | "crypto";
  currentPrice: number;
  userCash: number; // To display available cash
  userShares: number; // To display available shares
  // A trigger button can be passed in, or it will use a default one.
  children?: React.ReactNode;
}

// Defines the data structure sent to the placeOrder cloud function.
interface PlaceOrderData {
  competitionId: string;
  symbol: string;
  quantity: number; // Positive for buy, negative for sell
  assetType: "stock" | "crypto";
}

// Defines the expected success response from the cloud function.
interface PlaceOrderResult {
  success: boolean;
  message: string;
}

// --- Component ---

/**
 * A modal component for buying and selling assets within a competition.
 */
export function TradeModal({
  competitionId,
  symbol,
  assetType,
  currentPrice,
  userCash,
  userShares,
  children,
}: TradeModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [activeTab, setActiveTab] = useState("buy"); // 'buy' or 'sell'
  const [isLoading, setIsLoading] = useState(false);
  
  // Creates a callable reference to our Firebase Cloud Function.
  const placeOrder = httpsCallable<PlaceOrderData, PlaceOrderResult>(
    functions,
    "placeOrder"
  );

  const handleTrade = async () => {
    setIsLoading(true);
    
    const numQuantity = parseInt(quantity, 10);

    // Validate the quantity input.
    if (isNaN(numQuantity) || numQuantity <= 0) {
      toast.error("Please enter a valid, positive quantity.");
      setIsLoading(false);
      return;
    }

    // Determine the final quantity based on the active tab (buy/sell).
    const tradeQuantity = activeTab === "buy" ? numQuantity : -numQuantity;

    try {
      // Call the cloud function with the trade details.
      const result = await placeOrder({
        competitionId,
        symbol,
        quantity: tradeQuantity,
        assetType,
      });

      // On success, show a success toast, close the modal, and reset state.
      if (result.data.success) {
        toast.success(result.data.message || "Order placed successfully!");
        setIsOpen(false);
        setQuantity("");
      }
    } catch (err: any) {
      // On failure, display the error message from the function in a toast.
      console.error("Error placing order:", err);
      toast.error(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the estimated cost/proceeds of the trade.
  const estimatedTotal = (parseInt(quantity, 10) || 0) * currentPrice;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? children : <Button>Trade</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Trade {symbol.toUpperCase()}
          </DialogTitle>
          <DialogDescription>
            Current Price: ${currentPrice.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy">Buy</TabsTrigger>
            <TabsTrigger value="sell">Sell</TabsTrigger>
          </TabsList>
          <TabsContent value="buy">
            <div className="text-sm text-center text-muted-foreground pt-2">
              Available Cash: ${userCash.toFixed(2)}
            </div>
          </TabsContent>
          <TabsContent value="sell">
            <div className="text-sm text-center text-muted-foreground pt-2">
              Shares Owned: {userShares}
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-2 py-4">
          <label htmlFor="quantity" className="text-sm font-medium">
            Quantity
          </label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 10"
            min="1"
          />
          <div className="text-sm text-center text-muted-foreground">
            Estimated {activeTab === "buy" ? "Cost" : "Proceeds"}: $
            {estimatedTotal.toFixed(2)}
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleTrade}
            disabled={isLoading || !quantity}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isLoading
              ? "Placing Order..."
              : `Confirm ${activeTab === "buy" ? "Buy" : "Sell"}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
