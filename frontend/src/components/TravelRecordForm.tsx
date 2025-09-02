import React, { useState, useEffect } from 'react';
import { TravelRecord, TravelRecordCreate } from '../types';
import { travelRecordsApi } from '../services/api';

interface TravelRecordFormProps {
  record?: TravelRecord;
  onSave: () => void;
  onCancel: () => void;
}

const TravelRecordForm: React.FC<TravelRecordFormProps> = ({ record, onSave, onCancel }) => {
  const [formData, setFormData] = useState<TravelRecordCreate>({
    title: '',
    country: '',
    city: '',
    latitude: undefined,
    longitude: undefined,
    visit_date: '',
    rating: 5,
    category: '',
    notes: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setFormData({
        title: record.title,
        country: record.country,
        city: record.city,
        latitude: record.latitude,
        longitude: record.longitude,
        visit_date: record.visit_date.split('T')[0],
        rating: record.rating,
        category: record.category,
        notes: record.notes || '',
      });
    }
  }, [record]);

  const handleInputChange = (field: keyof TravelRecordCreate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const recordData = {
        ...formData,
        visit_date: new Date(formData.visit_date).toISOString(),
      };

      let savedRecord;
      if (record) {
        savedRecord = await travelRecordsApi.update(record.id, recordData);
      } else {
        savedRecord = await travelRecordsApi.create(recordData);
      }

      if (imageFile && savedRecord) {
        await travelRecordsApi.uploadImage(savedRecord.id, imageFile);
      }

      onSave();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '4px',
    fontWeight: 'bold' as const,
    color: '#333',
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <h2 style={{ margin: '0 0 24px 0' }}>
        {record ? 'Edit Travel Record' : 'Add New Travel Record'}
      </h2>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '16px',
          border: '1px solid #f5c6cb',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            style={inputStyle}
            required
            placeholder="Beautiful sunset at Santorini"
          />
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Country *</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              style={inputStyle}
              required
              placeholder="Greece"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              style={inputStyle}
              required
              placeholder="Santorini"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Latitude</label>
            <input
              type="number"
              step="any"
              value={formData.latitude || ''}
              onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : undefined)}
              style={inputStyle}
              placeholder="36.3932"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Longitude</label>
            <input
              type="number"
              step="any"
              value={formData.longitude || ''}
              onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : undefined)}
              style={inputStyle}
              placeholder="25.4615"
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Visit Date *</label>
            <input
              type="date"
              value={formData.visit_date}
              onChange={(e) => handleInputChange('visit_date', e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Rating *</label>
            <select
              value={formData.rating}
              onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
              style={inputStyle}
              required
            >
              <option value={1}>1 ★</option>
              <option value={2}>2 ★★</option>
              <option value={3}>3 ★★★</option>
              <option value={4}>4 ★★★★</option>
              <option value={5}>5 ★★★★★</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Category *</label>
          <input
            type="text"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            style={inputStyle}
            required
            placeholder="beach, cultural, nature, city, etc."
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            style={{
              ...inputStyle,
              minHeight: '80px',
              resize: 'vertical' as const,
            }}
            placeholder="Share your memories and experiences..."
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
            disabled={loading}
          >
            {loading ? 'Saving...' : (record ? 'Update' : 'Save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TravelRecordForm;