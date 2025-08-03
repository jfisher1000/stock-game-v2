import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Assume you have a function to place a trade order
// import { placeTradeOrder } from '@/api/trading'; 

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockSymbol: string;
}

const TradeModal: React.FC<TradeModalProps> = ({ isOpen, onClose, stockSymbol }) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [quantity, setQuantity] = useState('');

  if (!isOpen) return null;

  const handleTrade = async () => {
    // Basic validation
    if (!quantity || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
      alert('Please enter a valid quantity.');
      return;
    }
    
    try {
      // Here you would call your actual trade execution function
      // await placeTradeOrder({
      //   symbol: stockSymbol,
      //   quantity: parseInt(quantity),
      //   type: tradeType,
      // });
      console.log(`Executing ${tradeType} order for ${quantity} of ${stockSymbol}`);
      alert('Trade placed successfully!'); // Replace with better notification
      onClose();
    } catch (error) {
      console.error('Failed to place trade:', error);
      alert('Failed to place trade. See console for details.'); // Replace with better notification
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Trade {stockSymbol}</h2>
        
        <div className="mb-4">
          <div className="flex border border-input rounded-md">
            <button 
              onClick={() => setTradeType('buy')}
              className={`flex-1 p-2 rounded-l-md ${tradeType === 'buy' ? 'bg-primary text-primary-foreground' : 'bg-transparent'}`}
            >
              Buy
            </button>
            <button 
              onClick={() => setTradeType('sell')}
              className={`flex-1 p-2 rounded-r-md ${tradeType === 'sell' ? 'bg-destructive text-destructive-foreground' : 'bg-transparent'}`}
            >
              Sell
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="quantity" className="block text-sm font-medium text-muted-foreground mb-2">Quantity</label>
          <Input 
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="e.g., 10"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleTrade} className={tradeType === 'buy' ? 'bg-primary' : 'bg-destructive'}>
            Confirm {tradeType.charAt(0).toUpperCase() + tradeType.slice(1)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;
