import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

interface PackageStatusManagerProps {
  trackingNumber: string;
  currentStatus: string;
  userRole: string;
  onStatusUpdate: () => void;
}

// Predefined status options with location context
const STATUS_OPTIONS = [
  { value: 'created', label: 'Created', description: 'Package created and labeled at origin' },
  { value: 'dropped_off', label: 'Dropped Off', description: 'Package dropped off by customer at origin' },
  { value: 'picked_up', label: 'Picked Up', description: 'Package picked up from sender at origin' },
  { value: 'origin_depot', label: 'Origin Depot', description: 'Package at origin sorting facility' },
  { value: 'in_transit', label: 'In Transit', description: 'Package in transit between facilities' },
  { value: 'destination_depot', label: 'Destination Depot', description: 'Package at destination facility' },
  { value: 'out_for_delivery', label: 'Out for Delivery', description: 'Package with delivery driver at destination' },
  { value: 'delivered', label: 'Delivered', description: 'Package successfully delivered to recipient' },
  { value: 'exception', label: 'Exception', description: 'Delivery exception occurred' }
];

const PackageStatusManager: React.FC<PackageStatusManagerProps> = ({
  trackingNumber,
  currentStatus,
  userRole,
  onStatusUpdate
}) => {
  const [status, setStatus] = useState(currentStatus);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    if (!status) {
      toast.error('Please select a status');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/shipping/${trackingNumber}/update-status`, {
        status,
        description: description || `${status.replace('_', ' ')}`
      });

      if (response.data.success) {
        toast.success('Status updated successfully');
        onStatusUpdate();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error: any) {
      console.error('Status update error:', error);
      toast.error(error.response?.data?.error || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleDeliveryConfirmation = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/shipping/${trackingNumber}/confirm-delivery`, {
        signature: 'Digital Signature',
        notes: description || 'Delivery confirmed'
      });

      if (response.data.success) {
        toast.success('Delivery confirmed successfully');
        onStatusUpdate();
      } else {
        toast.error('Failed to confirm delivery');
      }
    } catch (error: any) {
      console.error('Delivery confirmation error:', error);
      toast.error(error.response?.data?.error || 'Failed to confirm delivery');
    } finally {
      setLoading(false);
    }
  };

  // Determine which status options are available based on user role and current status
  const getAvailableStatusOptions = () => {
    if (userRole === 'admin') {
      return STATUS_OPTIONS; // Admins can set any status
    }
    return [];
  };

  const availableStatusOptions = getAvailableStatusOptions();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Update Package Status
        <span className="text-sm font-normal text-gray-500 ml-2">
          (Admin Access)
        </span>
      </h3>

      <div className="space-y-4">
        {/* Status Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Status *
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {availableStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} - {option.description}
              </option>
            ))}
          </select>
        </div>



        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any additional notes about this status update..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleStatusUpdate}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Status'}
          </button>



        </div>

        {/* Current Status Display */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            <strong>Current Status:</strong> {currentStatus.replace('_', ' ').toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PackageStatusManager; 