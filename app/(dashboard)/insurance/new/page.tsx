/**
 * New Insurance Claim Page
 * 
 * Form for filing a new insurance claim
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, FileText, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ForensicCard, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function NewInsuranceClaimPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyIdParam = searchParams.get('propertyId');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [properties, setProperties] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    propertyId: propertyIdParam || '',
    carrierName: '',
    policyNumber: '',
    claimedAmount: '',
    deductible: '',
    filedAt: new Date().toISOString().split('T')[0],
    notes: '',
  });

  // Fetch user properties
  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          setProperties(data.properties || []);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      }
    }
    
    fetchProperties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/insurance/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          claimedAmount: formData.claimedAmount ? parseFloat(formData.claimedAmount) : null,
          deductible: formData.deductible ? parseFloat(formData.deductible) : null,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/insurance/${data.claimId}`);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create claim');
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
        <Link href="/insurance" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Claims
        </Link>
        <h1 className="page-title">File Insurance Claim</h1>
        <p className="page-description">
          Submit a new insurance claim with comprehensive documentation
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-6 bg-critical-50 border border-critical-200 text-critical-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Property Selection */}
        <ForensicCard className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-forensic-600" />
              Property & Carrier Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="propertyId" className="form-label">
                  Property *
                </label>
                <select
                  id="propertyId"
                  required
                  className="form-input"
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                >
                  <option value="">Select Property</option>
                  {properties.map((property) => (
                    <option key={property.id} value={property.id}>
                      {property.address}, {property.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="carrierName" className="form-label">
                  Insurance Carrier *
                </label>
                <input
                  id="carrierName"
                  type="text"
                  required
                  className="form-input"
                  value={formData.carrierName}
                  onChange={(e) => setFormData({ ...formData, carrierName: e.target.value })}
                  placeholder="State Farm, Allstate, etc."
                />
              </div>

              <div>
                <label htmlFor="policyNumber" className="form-label">
                  Policy Number
                </label>
                <input
                  id="policyNumber"
                  type="text"
                  className="form-input"
                  value={formData.policyNumber}
                  onChange={(e) => setFormData({ ...formData, policyNumber: e.target.value })}
                  placeholder="POL-123456"
                />
              </div>
            </div>
          </CardContent>
        </ForensicCard>

        {/* Financial Information */}
        <ForensicCard className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-forensic-600" />
              Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="claimedAmount" className="form-label">
                  Claimed Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="claimedAmount"
                    type="number"
                    required
                    className="form-input pl-8"
                    value={formData.claimedAmount}
                    onChange={(e) => setFormData({ ...formData, claimedAmount: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Total amount being claimed</p>
              </div>

              <div>
                <label htmlFor="deductible" className="form-label">
                  Deductible
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="deductible"
                    type="number"
                    className="form-input pl-8"
                    value={formData.deductible}
                    onChange={(e) => setFormData({ ...formData, deductible: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Policy deductible amount</p>
              </div>

              <div>
                <label htmlFor="filedAt" className="form-label">
                  Filing Date *
                </label>
                <input
                  id="filedAt"
                  type="date"
                  required
                  className="form-input"
                  value={formData.filedAt}
                  onChange={(e) => setFormData({ ...formData, filedAt: e.target.value })}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </CardContent>
        </ForensicCard>

        {/* Additional Notes */}
        <ForensicCard className="mb-6">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <label htmlFor="notes" className="form-label">
              Notes & Context
            </label>
            <textarea
              id="notes"
              rows={6}
              className="form-input"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any relevant details about the claim, carrier interactions, or special circumstances..."
            />
          </CardContent>
        </ForensicCard>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <Link href="/insurance" className="btn-secondary">
            Cancel
          </Link>
          <Button type="submit" isLoading={isLoading}>
            {isLoading ? 'Filing Claim...' : 'File Claim'}
          </Button>
        </div>
      </form>
    </div>
  );
}
