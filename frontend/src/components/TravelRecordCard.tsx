import React from 'react';
import { TravelRecord } from '../types';
import { travelRecordsApi } from '../services/api';

interface TravelRecordCardProps {
  record: TravelRecord;
  onEdit: (record: TravelRecord) => void;
  onDelete: (id: number) => void;
}

const TravelRecordCard: React.FC<TravelRecordCardProps> = ({ record, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '8px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      minWidth: '300px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{record.title}</h3>
          <p style={{ margin: '4px 0', color: '#666' }}>
            📍 {record.city}, {record.country}
          </p>
          <p style={{ margin: '4px 0', color: '#666' }}>
            📅 {formatDate(record.visit_date)}
          </p>
          <p style={{ margin: '4px 0', color: '#666' }}>
            🏷️ {record.category}
          </p>
          <p style={{ margin: '4px 0', fontSize: '18px' }}>
            {getRatingStars(record.rating)}
          </p>
          {record.notes && (
            <p style={{ margin: '8px 0', color: '#555', fontStyle: 'italic' }}>
              "{record.notes}"
            </p>
          )}
        </div>
        {record.image_filename && (
          <div style={{ marginLeft: '16px' }}>
            <img
              src={travelRecordsApi.getImageUrl(record.id)}
              alt={record.title}
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onEdit(record)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(record.id)}
          style={{
            padding: '6px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TravelRecordCard;