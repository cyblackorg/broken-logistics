import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import PaymentForm from './PaymentForm';
import SavedCards from './SavedCards';

const API_BASE_URL = 'http://localhost:5000/api';

interface State {
  code: string;
  name: string;
  coordinates: { lat: number; lng: number };
}

interface PackageSize {
  key: string;
  name: string;
  maxWeight: number;
  maxDimensions: { length: number; width: number; height: number };
  basePrice: number;
}

interface SpeedOption {
  key: string;
  name: string;
  days: number;
  multiplier: number;
  description: string;
}

interface Quote {
  baseCost: number;
  distanceCost: number;
  weightCost: number;
  speedCost: number;
  totalCost: number;
  distance: number;
  estimatedDays: number;
}

const ShippingForm: React.FC = () => {
  const { user } = useAuth();
  const [states, setStates] = useState<State[]>([]);
  const [packageSizes, setPackageSizes] = useState<PackageSize[]>([]);
  const [speedOptions, setSpeedOptions] = useState<SpeedOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [savedCards, setSavedCards] = useState([
    {
      id: 'card1',
      last4: '1234',
      brand: 'Visa',
      expiry: '12/25',
      name: 'John Doe',
      isDefault: true
    },
    {
      id: 'card2', 
      last4: '5678',
      brand: 'Mastercard',
      expiry: '03/26',
      name: 'John Doe',
      isDefault: false
    }
  ]);

  // Form data with pre-filled sender info
  const [formData, setFormData] = useState({
    senderName: user?.name || '',
    senderEmail: user?.email || '',
    senderPhone: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    originState: '',
    destinationState: '',
    packageSize: '',
    weight: '',
    speed: '',
    contents: '',
    declaredValue: '',
    deliveryInstructions: ''
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [statesRes, sizesRes, speedsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/shipping/states`),
          axios.get(`${API_BASE_URL}/shipping/package-sizes`),
          axios.get(`${API_BASE_URL}/shipping/speed-options`)
        ]);

        setStates(statesRes.data.states);
        setPackageSizes(sizesRes.data.packageSizes);
        setSpeedOptions(speedsRes.data.speedOptions);
      } catch (error) {
        toast.error('Failed to load shipping options');
      }
    };

    loadData();
  }, []);

  // Calculate quote when relevant fields change
  useEffect(() => {
    if (formData.originState && formData.destinationState && 
        formData.packageSize && formData.weight && formData.speed) {
      calculateQuote();
    }
  }, [formData.originState, formData.destinationState, formData.packageSize, formData.weight, formData.speed]);

  const calculateQuote = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/shipping/calculate`, {
        originState: formData.originState,
        destinationState: formData.destinationState,
        packageSize: formData.packageSize,
        weight: parseFloat(formData.weight),
        speed: formData.speed
      });

      setQuote(response.data.quote);
    } catch (error) {
      console.error('Quote calculation error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quote) {
      toast.error('Please calculate shipping cost first');
      return;
    }

    // Show payment form
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    setLoading(true);
    setShowPayment(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/shipping/create`, {
        ...formData,
        paymentId,
        selectedCard: selectedCard?.id
      });
      
      toast.success('Shipment created successfully!');
      
      // Reset form
      setFormData({
        senderName: user?.name || '',
        senderEmail: user?.email || '',
        senderPhone: '',
        recipientName: '',
        recipientEmail: '',
        recipientPhone: '',
        originState: '',
        destinationState: '',
        packageSize: '',
        weight: '',
        speed: '',
        contents: '',
        declaredValue: '',
        deliveryInstructions: ''
      });
      setQuote(null);
      setSelectedCard(null);

      // Show tracking number
      if (response.data.shipment?.trackingNumber) {
        toast.success(`Tracking Number: ${response.data.shipment.trackingNumber}`);
      }

    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create shipment');
    } finally {
      setLoading(false);
    }
  };

  const handleCardSelect = (card: any) => {
    setSelectedCard(card);
  };

  const handleDeleteCard = (cardId: string) => {
    setSavedCards(prev => prev.filter(card => card.id !== cardId));
    if (selectedCard?.id === cardId) {
      setSelectedCard(null);
    }
  };

  const handleSetDefaultCard = (cardId: string) => {
    setSavedCards(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Shipment</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sender Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Sender Information {user && <span className="text-sm font-normal text-gray-500">(Your Account)</span>}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleInputChange}
                required
                disabled={!!user}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  user ? 'bg-gray-100 text-gray-600' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="senderEmail"
                value={formData.senderEmail}
                onChange={handleInputChange}
                required
                disabled={!!user}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  user ? 'bg-gray-100 text-gray-600' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="senderPhone"
                value={formData.senderPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Recipient Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recipient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="recipientPhone"
                value={formData.recipientPhone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Origin State *
              </label>
              <select
                name="originState"
                value={formData.originState}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Origin State</option>
                {states.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination State *
              </label>
              <select
                name="destinationState"
                value={formData.destinationState}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Destination State</option>
                {states.map(state => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Package Size *
              </label>
              <select
                name="packageSize"
                value={formData.packageSize}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Package Size</option>
                {packageSizes.map(size => (
                  <option key={size.key} value={size.key}>
                    {size.name} (Max {size.maxWeight} lbs)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                min="0.1"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speed *
              </label>
              <select
                name="speed"
                value={formData.speed}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Speed</option>
                {speedOptions.map(speed => (
                  <option key={speed.key} value={speed.key}>
                    {speed.name} - {speed.description}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Declared Value ($)
              </label>
              <input
                type="number"
                name="declaredValue"
                value={formData.declaredValue}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Package Contents */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contents Description
              </label>
              <textarea
                name="contents"
                value={formData.contents}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe the contents of your package..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Instructions
              </label>
              <textarea
                name="deliveryInstructions"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Special delivery instructions..."
              />
            </div>
          </div>
        </div>

        {/* Quote Display */}
        {quote && (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Shipping Quote</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Distance:</span>
                <p className="font-semibold">{quote.distance} miles</p>
              </div>
              <div>
                <span className="text-gray-600">Base Cost:</span>
                <p className="font-semibold">${quote.baseCost}</p>
              </div>
              <div>
                <span className="text-gray-600">Distance Cost:</span>
                <p className="font-semibold">${quote.distanceCost}</p>
              </div>
              <div>
                <span className="text-gray-600">Weight Cost:</span>
                <p className="font-semibold">${quote.weightCost}</p>
              </div>
              <div>
                <span className="text-gray-600">Speed Cost:</span>
                <p className="font-semibold">${quote.speedCost}</p>
              </div>
              <div>
                <span className="text-gray-600">Estimated Days:</span>
                <p className="font-semibold">{quote.estimatedDays}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600">Total Cost:</span>
                <p className="text-xl font-bold text-blue-900">${quote.totalCost}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Section */}
        {quote && (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            
            {/* Saved Cards */}
            <SavedCards
              cards={savedCards}
              onSelectCard={handleCardSelect}
              onDeleteCard={handleDeleteCard}
              onSetDefault={handleSetDefaultCard}
            />
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Total to pay: <span className="font-bold text-lg text-blue-600">${quote.totalCost}</span></p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !quote}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Shipment...' : 'Proceed to Payment'}
          </button>
        </div>
      </form>

      {/* Payment Modal */}
      {showPayment && quote && (
        <PaymentForm
          amount={quote.totalCost}
          onPaymentSuccess={handlePaymentSuccess}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};

export default ShippingForm; 