import React, { useState, useEffect } from 'react';
import { TravelRecord, TravelRecordList as TravelRecordListType } from '../types';
import { travelRecordsApi } from '../services/api';
import TravelRecordCard from './TravelRecordCard';

interface TravelRecordListProps {
  onEdit: (record: TravelRecord) => void;
  refreshTrigger: number;
}

const TravelRecordList: React.FC<TravelRecordListProps> = ({ onEdit, refreshTrigger }) => {
  const [records, setRecords] = useState<TravelRecordListType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    country: '',
    city: '',
    category: '',
    min_rating: '',
  });

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (filters.country) params.country = filters.country;
      if (filters.city) params.city = filters.city;
      if (filters.category) params.category = filters.category;
      if (filters.min_rating) params.min_rating = parseInt(filters.min_rating);

      const data = await travelRecordsApi.getAll(params);
      setRecords(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch travel records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [refreshTrigger, filters]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await travelRecordsApi.delete(id);
        fetchRecords();
      } catch (err) {
        alert('Failed to delete record');
      }
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>;
  }

  return (
    <div>
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        marginBottom: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{ margin: '0 0 16px 0' }}>Filter Records</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Country"
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minWidth: '120px',
            }}
          />
          <input
            type="text"
            placeholder="City"
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minWidth: '120px',
            }}
          />
          <input
            type="text"
            placeholder="Category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minWidth: '120px',
            }}
          />
          <select
            value={filters.min_rating}
            onChange={(e) => handleFilterChange('min_rating', e.target.value)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              minWidth: '120px',
            }}
          >
            <option value="">Min Rating</option>
            <option value="1">1+ Stars</option>
            <option value="2">2+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="4">4+ Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>
          Travel Records ({records?.total || 0})
        </h2>
      </div>

      {!records?.records.length ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No travel records found. Add your first travel memory!
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {records.records.map(record => (
            <TravelRecordCard
              key={record.id}
              record={record}
              onEdit={onEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TravelRecordList;