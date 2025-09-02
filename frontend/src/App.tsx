import React, { useState } from 'react';
import { TravelRecord } from './types';
import TravelRecordList from './components/TravelRecordList';
import TravelRecordForm from './components/TravelRecordForm';

const App: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TravelRecord | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddNew = () => {
    setEditingRecord(undefined);
    setShowForm(true);
  };

  const handleEdit = (record: TravelRecord) => {
    setEditingRecord(record);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setEditingRecord(undefined);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingRecord(undefined);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '32px',
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <h1 style={{
            margin: '0 0 8px 0',
            color: '#333',
            fontSize: '2.5rem',
          }}>
            🌍 Travel Journal
          </h1>
          <p style={{
            margin: '0 0 16px 0',
            color: '#666',
            fontSize: '1.1rem',
          }}>
            Keep track of your adventures and memories
          </p>
          <button
            onClick={handleAddNew}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
            }}
            onMouseOver={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#0056b3';
            }}
            onMouseOut={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor = '#007bff';
            }}
          >
            ✈️ Add New Travel Record
          </button>
        </header>

        {showForm ? (
          <TravelRecordForm
            record={editingRecord}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <TravelRecordList
            onEdit={handleEdit}
            refreshTrigger={refreshTrigger}
          />
        )}
      </div>
    </div>
  );
};

export default App;