# API Documentation - Equity Builders

## Overview

The Equity Builders platform provides a RESTful API for all data operations. All API routes are located under `/api/` and require authentication unless otherwise specified.

## Authentication

### Register

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "role": "OWNER",
  "phone": "555-123-4567"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "OWNER"
    }
  }
}
```

**Errors**:
- `409` - Email already exists
- `400` - Validation error

---

### Login

Authenticate an existing user.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "OWNER"
    }
  }
}
```

**Errors**:
- `401` - Invalid credentials
- `403` - Account disabled

---

### Logout

Destroy the current session.

**Endpoint**: `POST /api/auth/logout`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## Properties

### List Properties

Get all properties for the authenticated user.

**Endpoint**: `GET /api/properties`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "properties": [
      {
        "id": "uuid",
        "name": "Riverside Plaza",
        "addressStreet": "123 Main St",
        "addressCity": "Houston",
        "addressState": "TX",
        "addressZip": "77002",
        "propertyType": "RETAIL",
        "status": "CLAIM_FILED",
        "squareFootage": 45000,
        "yearBuilt": 2005,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "totalPages": 1
  }
}
```

---

### Create Property

Create a new property.

**Endpoint**: `POST /api/properties`

**Authorization**: OWNER, INTERNAL roles only

**Request Body**:
```json
{
  "name": "Tech Center Building",
  "addressStreet": "456 Innovation Dr",
  "addressCity": "Austin",
  "addressState": "TX",
  "addressZip": "78701",
  "addressCountry": "USA",
  "propertyType": "OFFICE",
  "squareFootage": 62000,
  "yearBuilt": 2010,
  "stories": 5
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "property": {
      "id": "uuid",
      "name": "Tech Center Building",
      "addressStreet": "456 Innovation Dr",
      "addressCity": "Austin",
      "addressState": "TX",
      "addressZip": "78701",
      "propertyType": "OFFICE",
      "status": "INITIAL_ASSESSMENT",
      "squareFootage": 62000,
      "yearBuilt": 2010,
      "stories": 5,
      "createdAt": "2024-01-20T12:00:00Z"
    }
  }
}
```

**Errors**:
- `400` - Validation error
- `403` - Permission denied

---

## Damage Assessments

### Create Damage Assessment

Document damage for a property.

**Endpoint**: `POST /api/damage-assessments`

**Request Body**:
```json
{
  "propertyId": "uuid",
  "category": "STRUCTURAL",
  "severity": "MAJOR",
  "description": "Significant structural damage to main support beams",
  "estimatedCost": 285000,
  "location": "North wing, first floor"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "assessment": {
      "id": "uuid",
      "propertyId": "uuid",
      "category": "STRUCTURAL",
      "severity": "MAJOR",
      "description": "Significant structural damage to main support beams",
      "estimatedCost": 285000,
      "location": "North wing, first floor",
      "verified": false,
      "assessedAt": "2024-01-20T14:30:00Z"
    }
  }
}
```

---

## Evidence

### Upload Evidence

Upload photos, videos, or documents as evidence.

**Endpoint**: `POST /api/evidence`

**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: File to upload
- `propertyId`: UUID of property
- `damageAssessmentId`: UUID of assessment (optional)
- `type`: PHOTO | VIDEO | DOCUMENT | REPORT
- `caption`: Description (optional)

**Response** (200):
```json
{
  "success": true,
  "data": {
    "evidence": {
      "id": "uuid",
      "propertyId": "uuid",
      "type": "PHOTO",
      "url": "https://storage.example.com/evidence/photo.jpg",
      "filename": "damage-photo-001.jpg",
      "size": 2458000,
      "caption": "Roof damage from northeast corner",
      "verified": false,
      "uploadedAt": "2024-01-20T15:00:00Z"
    }
  }
}
```

---

## Insurance Claims

### Create Claim

File a new insurance claim.

**Endpoint**: `POST /api/claims`

**Request Body**:
```json
{
  "propertyId": "uuid",
  "claimNumber": "CLM-2024-1547",
  "carrier": "Liberty Mutual",
  "policyNumber": "POL-887654",
  "dateOfLoss": "2023-12-10",
  "claimedAmount": 875000,
  "deductible": 25000,
  "adjusterId": "uuid"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "claim": {
      "id": "uuid",
      "propertyId": "uuid",
      "claimNumber": "CLM-2024-1547",
      "carrier": "Liberty Mutual",
      "policyNumber": "POL-887654",
      "status": "DRAFT",
      "dateOfLoss": "2023-12-10T00:00:00Z",
      "claimedAmount": 875000,
      "deductible": 25000,
      "createdAt": "2024-01-20T16:00:00Z"
    }
  }
}
```

---

### Update Claim Status

Update the status of a claim.

**Endpoint**: `PATCH /api/claims/:claimId`

**Request Body**:
```json
{
  "status": "SUBMITTED",
  "dateSubmitted": "2024-01-21",
  "approvedAmount": 850000
}
```

---

## Work Orders

### Create Work Order

Assign work to a contractor.

**Endpoint**: `POST /api/work-orders`

**Request Body**:
```json
{
  "propertyId": "uuid",
  "contractorId": "uuid",
  "title": "Structural Repairs & Reinforcement",
  "description": "Complete structural reinforcement per engineering specs",
  "scope": [
    "Replace damaged support beams",
    "Reinforce foundation",
    "Install steel reinforcement"
  ],
  "estimatedCost": 285000,
  "permitRequired": true
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "workOrder": {
      "id": "uuid",
      "propertyId": "uuid",
      "contractorId": "uuid",
      "title": "Structural Repairs & Reinforcement",
      "status": "PENDING",
      "estimatedCost": 285000,
      "permitRequired": true,
      "createdAt": "2024-01-20T17:00:00Z"
    }
  }
}
```

---

## ATOS Guidance

### Get Contextual Guidance

Request AI guidance for current context.

**Endpoint**: `POST /api/atos/guidance`

**Request Body**:
```json
{
  "propertyId": "uuid",
  "currentModule": "forensic",
  "currentAction": "damage_assessment",
  "question": "What damage categories should I prioritize documenting?"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "guidance": {
      "guidance": "Focus on STRUCTURAL and ROOF categories first...",
      "reasoning": "These categories typically represent highest claim values...",
      "suggestedActions": [
        {
          "label": "Document structural damage with measurements",
          "action": "document_structural",
          "priority": "HIGH"
        }
      ],
      "risks": ["Incomplete structural documentation may reduce claim approval"],
      "opportunities": ["Thorough documentation supports higher valuations"]
    }
  }
}
```

---

## Error Responses

All API errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Input validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Permission denied
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource already exists
- `INTERNAL_ERROR` - Server error

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## Rate Limiting

**Development**: No rate limiting

**Production**: 
- 100 requests per minute per IP
- 1000 requests per hour per user
- Burst limit: 20 requests per second

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642521600
```

---

## Pagination

List endpoints support pagination:

**Query Parameters**:
- `page`: Page number (1-indexed)
- `limit`: Items per page (max: 100)

**Response Meta**:
```json
{
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Filtering & Sorting

**Query Parameters**:
- `status`: Filter by status
- `propertyType`: Filter by property type
- `sortBy`: Field to sort by
- `sortOrder`: asc | desc

Example:
```
GET /api/properties?status=CLAIM_FILED&sortBy=createdAt&sortOrder=desc
```

---

## Webhooks

**Coming Soon**: Webhook support for real-time updates

Events:
- `property.created`
- `claim.status_changed`
- `work_order.completed`
- `evidence.verified`

---

## SDK / Client Libraries

**Coming Soon**: Official SDKs for:
- JavaScript/TypeScript
- Python
- Ruby

---

## API Versioning

Current version: `v1`

Future versions will be namespaced:
- `/api/v1/properties`
- `/api/v2/properties`

---

## Support

For API support:
- Email: api-support@equitybuilders.com
- Documentation: https://docs.equitybuilders.com
- Status: https://status.equitybuilders.com
