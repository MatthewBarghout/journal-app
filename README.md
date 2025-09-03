
## Tech Stack

### Backend
- FastAPI — REST framework with automatic docs and validation
- SQLAlchemy + SQLite — ORM and local database
- Pydantic — input/output validation and serialization
- Uvicorn — ASGI server for running FastAPI
- File handling — image uploads stored locally in `/uploads`

### Frontend
- React (TypeScript) — component-based UI
- Axios — HTTP client for API calls
- CSS-in-JS (inline styles) — simple styling

---

## Project Structure

### Backend (`/app`)
- `main.py` — FastAPI entrypoint, creates tables, configures CORS, includes routers
- `database.py` — engine, session, base class, `get_db()` dependency
- `models/travel_record.py` — SQLAlchemy model (travel_records table)
- `schemas/travel_record.py` — Pydantic schemas for validation & responses
- `routers/travel_records.py` — REST API endpoints (CRUD, filters, images, stats)
- `services/travel_service.py` — database logic and aggregate queries

### Frontend (`/frontend`)
- `services/api.ts` — Axios wrapper for API
- `types.ts` — TypeScript interfaces matching backend schemas
- `components/TravelRecordCard.tsx` — renders one record
- `components/TravelRecordForm.tsx` — create/edit record form + image upload
- `components/TravelRecordList.tsx` — fetch/filter/display records
- `App.tsx` — orchestrates list vs form views
- `index.tsx` — React entrypoint

---

## Features

### CRUD Endpoints
- `POST /api/v1/travel-records/` — create a new record
- `GET /api/v1/travel-records/` — list with filters & pagination
- `GET /api/v1/travel-records/{id}` — get a specific record
- `PUT /api/v1/travel-records/{id}` — update a record (partial updates supported)
- `DELETE /api/v1/travel-records/{id}` — delete a record

### Bonus Endpoints
- `POST /api/v1/travel-records/{id}/image` — upload an image
- `GET /api/v1/travel-records/{id}/image` — fetch the image
- `GET /api/v1/travel-records/stats/aggregate` — return aggregate statistics

### Aggregates Returned
- Average rating by country
- Top destination by month
- Category distribution
- Total countries visited
- Total cities visited

---

## Design Choices

- **Layered Architecture**  
  - Models — define database schema  
  - Schemas — enforce request/response validation  
  - Routers — HTTP mapping and error handling  
  - Services — centralized database/business logic  

- **Validation & Error Handling**  
  - Pydantic validates inputs (e.g., rating 1–5, lat/lon ranges)  
  - FastAPI auto-returns 422 on bad inputs  
  - Consistent 404/400 exceptions where appropriate  

- **Images**  
  - Files stored locally in `/uploads` with UUID filenames  
  - Database stores only the filename → simpler and lighter  
  - In production, could migrate to S3 with presigned URLs  

- **Frontend**  
  - React components are split into presentational and data-fetching parts  
  - Axios wrapper centralizes API calls  
  - Filters update query params dynamically

---

## Example Usage

### Create a record
```json
{
  "title": "Trip to Jordan",
  "country": "Jordan",
  "city": "Mafraq",
  "latitude": 32.34,
  "longitude": 36.21,
  "visit_date": "2025-06-03T00:00:00",
  "rating": 5,
  "category": "Family",
  "notes": "Visited family"
}
