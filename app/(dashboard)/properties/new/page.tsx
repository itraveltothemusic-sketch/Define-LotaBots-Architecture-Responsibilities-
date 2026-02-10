/**
 * New Property Page
 * 
 * Form for adding a new storm-damaged property
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, MapPin, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ForensicCard, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function NewPropertyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'commercial',
    squareFootage: '',
    yearBuilt: '',
    stormDate: '',
    stormType: '',
    preDamageValue: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          squareFootage: formData.squareFootage ? parseInt(formData.squareFootage) : null,
          yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null,
          preDamageValue: formData.preDamageValue ? parseFloat(formData.preDamageValue) : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/properties/${data.propertyId}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create property');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link href="/properties" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>
        <h1 className="page-title">Add New Property</h1>
        <p className="page-description">
          Register a storm-damaged property to begin the forensic intelligence process
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 bg-critical-50 border border-critical-200 text-critical-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Property Address */}
        <ForensicCard className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-forensic-600" />
              Property Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="address" className="form-label">
                  Street Address *
                </label>
                <input
                  id="address"
                  type="text"
                  required
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main Street"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="form-label">
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              
              <div>
                <label htmlFor="state" className="form-label">
                  State *
                </label>
                <select
                  id="state"
                  required
                  className="form-input"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                >
                  <option value="">Select State</option>
                  <option value="AL">Alabama</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="LA">Louisiana</option>
                  <option value="MS">Mississippi</option>
                  <option value="NC">North Carolina</option>
                  <option value="SC">South Carolina</option>
                  <option value="TX">Texas</option>
                  {/* Add more states as needed */}
                </select>
              </div>
              
              <div>
                <label htmlFor="zipCode" className="form-label">
                  ZIP Code *
                </label>
                <input
                  id="zipCode"
                  type="text"
                  required
                  className="form-input"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  placeholder="12345"
                />
              </div>
            </div>
          </CardContent>
        </ForensicCard>

        {/* Property Details */}
        <ForensicCard className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-forensic-600" />
              Property Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="propertyType" className="form-label">
                  Property Type *
                </label>
                <select
                  id="propertyType"
                  required
                  className="form-input"
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                >
                  <option value="commercial">Commercial</option>
                  <option value="retail">Retail</option>
                  <option value="office">Office</option>
                  <option value="industrial">Industrial</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="mixed-use">Mixed Use</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="squareFootage" className="form-label">
                  Square Footage
                </label>
                <input
                  id="squareFootage"
                  type="number"
                  className="form-input"
                  value={formData.squareFootage}
                  onChange={(e) => setFormData({ ...formData, squareFootage: e.target.value })}
                  placeholder="5000"
                />
              </div>
              
              <div>
                <label htmlFor="yearBuilt" className="form-label">
                  Year Built
                </label>
                <input
                  id="yearBuilt"
                  type="number"
                  className="form-input"
                  value={formData.yearBuilt}
                  onChange={(e) => setFormData({ ...formData, yearBuilt: e.target.value })}
                  placeholder="2000"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>
              
              <div>
                <label htmlFor="preDamageValue" className="form-label">
                  Pre-Damage Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="preDamageValue"
                    type="number"
                    className="form-input pl-8"
                    value={formData.preDamageValue}
                    onChange={(e) => setFormData({ ...formData, preDamageValue: e.target.value })}
                    placeholder="500000"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </ForensicCard>

        {/* Storm Information */}
        <ForensicCard className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-forensic-600" />
              Storm Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="stormType" className="form-label">
                  Storm Type *
                </label>
                <select
                  id="stormType"
                  required
                  className="form-input"
                  value={formData.stormType}
                  onChange={(e) => setFormData({ ...formData, stormType: e.target.value })}
                >
                  <option value="">Select Type</option>
                  <option value="hurricane">Hurricane</option>
                  <option value="tornado">Tornado</option>
                  <option value="hail">Hail Storm</option>
                  <option value="flood">Flood</option>
                  <option value="wind">Wind Damage</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="stormDate" className="form-label">
                  Storm Date *
                </label>
                <input
                  id="stormDate"
                  type="date"
                  required
                  className="form-input"
                  value={formData.stormDate}
                  onChange={(e) => setFormData({ ...formData, stormDate: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="form-label">
                  Initial Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the visible damage and initial observations..."
                />
              </div>
            </div>
          </CardContent>
        </ForensicCard>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link href="/properties" className="btn-secondary">
            Cancel
          </Link>
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Creating Property...' : 'Create Property'}
          </Button>
        </div>
      </form>
    </div>
  );
}
