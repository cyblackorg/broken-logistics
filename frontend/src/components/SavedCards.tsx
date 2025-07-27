import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface SavedCard {
  id: string;
  last4: string;
  brand: string;
  expiry: string;
  name: string;
  isDefault: boolean;
}

interface SavedCardsProps {
  cards: SavedCard[];
  onSelectCard: (card: SavedCard) => void;
  onDeleteCard: (cardId: string) => void;
  onSetDefault: (cardId: string) => void;
}

const SavedCards: React.FC<SavedCardsProps> = ({ 
  cards, 
  onSelectCard, 
  onDeleteCard, 
  onSetDefault 
}) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const getCardIcon = (brand: string) => {
    switch (brand.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };

  const handleSelectCard = (card: SavedCard) => {
    setSelectedCard(card.id);
    onSelectCard(card);
  };

  const handleDeleteCard = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this card?')) {
      onDeleteCard(cardId);
      toast.success('Card deleted successfully');
    }
  };

  const handleSetDefault = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSetDefault(cardId);
    toast.success('Default card updated');
  };

  if (cards.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-6xl mb-4">💳</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No saved cards</h3>
        <p className="text-gray-500">You haven't saved any payment cards yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Payment Methods</h3>
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={() => handleSelectCard(card)}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedCard === card.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{getCardIcon(card.brand)}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">
                    {card.brand} •••• {card.last4}
                  </span>
                  {card.isDefault && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  {card.name} • Expires {card.expiry}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!card.isDefault && (
                <button
                  onClick={(e) => handleSetDefault(card.id, e)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={(e) => handleDeleteCard(card.id, e)}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedCards; 