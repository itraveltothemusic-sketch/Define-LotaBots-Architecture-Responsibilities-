/**
 * Property Timeline Component
 * 
 * Displays chronological activity timeline for a property
 */

import { FileSearch, FileText, Upload, CheckCircle, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface TimelineEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: Date;
  actor?: string;
}

interface PropertyTimelineProps {
  propertyId: string;
}

// Mock data - in production, this would fetch from the activity log
const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'inspection',
    title: 'Forensic Inspection Completed',
    description: 'Comprehensive damage assessment documented with 45 photos and 3 videos',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    actor: 'John Smith',
  },
  {
    id: '2',
    type: 'document',
    title: 'Insurance Estimate Uploaded',
    description: 'Carrier provided initial damage estimate',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    actor: 'State Farm',
  },
  {
    id: '3',
    type: 'claim',
    title: 'Claim Submitted',
    description: 'Insurance claim filed with complete documentation package',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    actor: 'Equity Builders',
  },
  {
    id: '4',
    type: 'property',
    title: 'Property Registered',
    description: 'Initial property assessment and damage documentation',
    timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    actor: 'Property Owner',
  },
];

export function PropertyTimeline({ propertyId }: PropertyTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'inspection':
        return FileSearch;
      case 'claim':
        return FileText;
      case 'document':
        return Upload;
      case 'completion':
        return CheckCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-6">
      {mockEvents.map((event, index) => {
        const Icon = getEventIcon(event.type);
        const isLast = index === mockEvents.length - 1;
        
        return (
          <div key={event.id} className={`relative ${!isLast ? 'pb-6' : ''}`}>
            {!isLast && (
              <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
            )}
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-forensic-100 rounded-full flex items-center justify-center ring-4 ring-white">
                <Icon className="h-4 w-4 text-forensic-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                  {event.actor && <span>{event.actor}</span>}
                  <span>•</span>
                  <span>{formatDateTime(event.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
