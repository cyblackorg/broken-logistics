import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Quote {
  id: number;
  quote_number: string;
  status: string;
  package_type: string;
  weight: number;
  dimensions: string;
  service_type: string;
  total_price: number;
  expires_at: string;
  pickup_address: string;
  delivery_address: string;
  customer_type_applied: string;
  created_at: string;
}

interface PricingResult {
  basePrice: number;
  distancePrice: number;
  weightPrice: number;
  servicePrice: number;
  discountAmount: number;
  totalPrice: number;
}

const QuoteManager: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'create' | 'list'>('create');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPricing, setCurrentPricing] = useState<PricingResult | null>(null);

  // Quote form state
  const [formData, setFormData] = useState({
    packageType: 'small',
    weight: '',
    dimensions: '',
    serviceType: 'standard',
    distanceMiles: '',
    isVIP: false // Vulnerable: client-side VIP control
  });

  // Mock addresses for demo
  const mockAddresses = [
    { id: 1, label: 'Home - 123 Main St, New York, NY' },
    { id: 2, label: 'Office - 456 Oak Ave, Los Angeles, CA' },
    { id: 3, label: 'Warehouse - 789 Pine Rd, Chicago, IL' }
  ];

  const [pickupAddress, setPickupAddress] = useState('2');
  const [deliveryAddress, setDeliveryAddress] = useState('1');

  useEffect(() => {
    if (activeView === 'list') {
      fetchQuotes();
    }
  }, [activeView]);

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      // Vulnerable: No authentication token, exposed customer ID
      const response = await fetch(`http://localhost:5000/api/quotes?customerId=${user?.id || 3}`);
      const data = await response.json();
      
      if (data.success) {
        setQuotes(data.quotes);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePricing = async () => {
    if (!formData.weight || !formData.distanceMiles) {
      alert('Please enter weight and distance');
      return;
    }

    try {
      setIsLoading(true);
      
      // Vulnerable: Exposing customer type and allowing VIP manipulation
      const response = await fetch('http://localhost:5000/api/quotes/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerType: user?.customer_type || 'individual',
          packageType: formData.packageType,
          serviceType: formData.serviceType,
          weight: parseFloat(formData.weight),
          distanceMiles: parseFloat(formData.distanceMiles),
          isVIP: formData.isVIP // Vulnerable: client controls VIP status
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentPricing(data.pricing);
      } else {
        alert('Error calculating pricing: ' + data.error);
      }
    } catch (error) {
      console.error('Error calculating pricing:', error);
      alert('Error calculating pricing');
    } finally {
      setIsLoading(false);
    }
  };

  const createQuote = async () => {
    if (!currentPricing) {
      alert('Please calculate pricing first');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch('http://localhost:5000/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user?.id || 3,
          pickupAddressId: parseInt(pickupAddress),
          deliveryAddressId: parseInt(deliveryAddress),
          packageType: formData.packageType,
          weight: parseFloat(formData.weight),
          dimensions: formData.dimensions,
          distanceMiles: parseFloat(formData.distanceMiles),
          serviceType: formData.serviceType,
          isVIP: formData.isVIP
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Quote created successfully! Quote #: ' + data.quote.quoteNumber);
        setActiveView('list');
        // Reset form
        setFormData({
          packageType: 'small',
          weight: '',
          dimensions: '',
          serviceType: 'standard',
          distanceMiles: '',
          isVIP: false
        });
        setCurrentPricing(null);
      } else {
        alert('Error creating quote: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      alert('Error creating quote');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptQuote = async (quoteNumber: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`http://localhost:5000/api/quotes/${quoteNumber}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: user?.id || 3,
          bypassExpiry: true // Vulnerable: bypassing expiry check
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Quote accepted! Your tracking number is: ${data.trackingNumber}`);
        fetchQuotes(); // Refresh quotes list
      } else {
        alert('Error accepting quote: ' + data.error);
      }
    } catch (error) {
      console.error('Error accepting quote:', error);
      alert('Error accepting quote');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const renderCreateQuote = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-yellow-600 text-lg mr-2">🎯</span>
          <div>
            <h3 className="font-medium text-yellow-800">Quote Creator Pro</h3>
            <p className="text-sm text-yellow-700">
              Create instant quotes with our totally secure pricing system!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Package Details */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Package Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Type
              </label>
              <select
                name="packageType"
                value={formData.packageType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="document">Document</option>
                <option value="small">Small Package</option>
                <option value="medium">Medium Package</option>
                <option value="large">Large Package</option>
                <option value="fragile">Fragile Item</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                step="0.1"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter weight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dimensions (L x W x H)
              </label>
              <input
                type="text"
                name="dimensions"
                value={formData.dimensions}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="12x8x6"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Type
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="standard">Standard (3-5 days)</option>
                <option value="express">Express (1-2 days)</option>
                <option value="overnight">Overnight</option>
                <option value="same_day">Same Day (VIP pricing!)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance (miles)
              </label>
              <input
                type="number"
                name="distanceMiles"
                value={formData.distanceMiles}
                onChange={handleInputChange}
                step="0.1"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter distance"
              />
            </div>

            {/* Vulnerable VIP toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVIP"
                name="isVIP"
                checked={formData.isVIP}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="isVIP" className="ml-2 text-sm text-gray-700">
                VIP Customer (50% discount!) 
                <span className="text-xs text-red-500 ml-1">✨ Anyone can enable this!</span>
              </label>
            </div>
          </div>
        </div>

        {/* Addresses */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Addresses</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Address
              </label>
              <select
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {mockAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>{addr.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address
              </label>
              <select
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {mockAddresses.map(addr => (
                  <option key={addr.id} value={addr.id}>{addr.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={calculatePricing}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
            >
              {isLoading ? 'Calculating...' : 'Calculate Pricing'}
            </button>
          </div>

          {currentPricing && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Pricing Breakdown</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>${currentPricing.basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance:</span>
                  <span>${currentPricing.distancePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight:</span>
                  <span>${currentPricing.weightPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee:</span>
                  <span>${currentPricing.servicePrice}</span>
                </div>
                {currentPricing.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-${currentPricing.discountAmount}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-green-800">
                  <span>Total:</span>
                  <span>${currentPricing.totalPrice}</span>
                </div>
              </div>
              
              <button
                onClick={createQuote}
                disabled={isLoading}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Quote'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderQuotesList = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-blue-600 text-lg mr-2">📋</span>
          <div>
            <h3 className="font-medium text-blue-800">Your Quotes</h3>
            <p className="text-sm text-blue-700">
              Manage your quotes and convert them to orders
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading quotes...</div>
        </div>
      ) : quotes.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500">No quotes found</div>
          <button
            onClick={() => setActiveView('create')}
            className="mt-2 text-blue-600 hover:text-blue-700"
          >
            Create your first quote
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {quotes.map((quote) => (
            <div key={quote.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{quote.quote_number}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      quote.status === 'active' ? 'bg-green-100 text-green-800' :
                      quote.status === 'expired' ? 'bg-red-100 text-red-800' :
                      quote.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quote.status}
                    </span>
                    {quote.customer_type_applied === 'business' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        Business Rate
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Package:</span>
                      <div className="font-medium">{quote.package_type}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Weight:</span>
                      <div className="font-medium">{quote.weight} lbs</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Service:</span>
                      <div className="font-medium">{quote.service_type}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <div className="font-bold text-green-600">${quote.total_price}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-sm text-gray-600">
                    <div>From: {quote.pickup_address}</div>
                    <div>To: {quote.delivery_address}</div>
                    <div>Expires: {new Date(quote.expires_at).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="ml-4">
                  {quote.status === 'active' && (
                    <button
                      onClick={() => acceptQuote(quote.quote_number)}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      Accept & Ship
                    </button>
                  )}
                  {quote.status === 'expired' && (
                    <button
                      onClick={() => acceptQuote(quote.quote_number)}
                      disabled={isLoading}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      Accept Anyway 😉
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Quote Manager</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveView('create')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeView === 'create' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Create Quote
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-4 py-2 rounded-md font-medium ${
                activeView === 'list' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              My Quotes
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeView === 'create' ? renderCreateQuote() : renderQuotesList()}
    </div>
  );
};

export default QuoteManager; 