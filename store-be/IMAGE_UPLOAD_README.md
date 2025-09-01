# Collection Image Upload Feature

## Overview

This feature allows admin users to upload images for jewelry collections through the API.

## API Endpoints

### Upload Collection Image

- **Endpoint**: `POST /api/collections/{collection_id}/upload-image`
- **Authentication**: Requires admin authentication
- **Content-Type**: `multipart/form-data`

**Parameters:**

- `collection_id` (path): ID of the collection to upload image for
- `file` (form-data): Image file to upload

**Supported Formats:**

- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

**File Size Limit:** 5MB maximum

**Response:**

```json
{
    "message": "Image uploaded successfully",
    "image_url": "/static/uploads/collections/collection_1_uuid.jpg",
    "collection": {
        "id": 1,
        "name": "Rings",
        "image": "uploads/collections/collection_1_uuid.jpg",
        ...
    }
}
```

### Get Collection Image

- **Endpoint**: `GET /api/collections/{collection_id}/image`
- **Authentication**: None required

**Response:**

```json
{
  "collection_id": 1,
  "collection_name": "Rings",
  "image_url": "/static/uploads/collections/collection_1_uuid.jpg"
}
```

## File Storage

- Images are stored in `static/uploads/collections/` directory
- Files are renamed with format: `collection_{id}_{uuid}.{extension}`
- Images are accessible via `/static/uploads/collections/{filename}` URL

## Current Collections

Your jewelry store has 11 collections:

1. Rings - Beautiful rings for all occasions
2. Earrings - Elegant earrings collection
3. Bangles - Traditional and modern bangles
4. Anklets - Delicate anklets and chains
5. Bracelets - Stylish bracelets collection
6. Pendants - Beautiful pendants and necklaces
7. Ear Studs - Trendy ear studs for daily wear
8. Hoops - Classic and modern hoops
9. Wall Frame Design - Decorative wall frames
10. Combos - Best combos of jewelry
11. Hair Accessories - Beautiful hair accessories and clips

## Testing

A test interface is available at: `http://localhost:8000/static/test_upload.html`

**Note:** The upload endpoint requires admin authentication. You'll need to:

1. Login as admin user first
2. Include the authorization token in your requests
3. Or temporarily remove the authentication dependency for testing
