'use client';

import { useEffect, useState } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

type Activity = {
  activity_id: number;
  substitution_id: number;
  created_at: string;
  rating: number | null;
  criteria: string;
  substitute_name: string;
  original_name: string;
};

export default function UserActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = typeof window !== 'undefined' ? localStorage.getItem('email') : null;

  const fetchActivities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/activity/userActivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Failed to fetch activity.');
        setActivities([]);
      } else {
        setActivities(data.results || []);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('An error occurred while fetching activities.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) fetchActivities();
  }, [email]);

  // update rating
  const handleRate = async (activityId: number, rating: number) => {
    
    setActivities(prev =>
      prev.map(a => (a.activity_id === activityId ? { ...a, rating } : a))
    );

    try {
      const res = await fetch('http://localhost:5000/api/activity/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, activityId, rating }),
      });

      const data = await res.json();
      if (!data.success) {
        
        setActivities(prev =>
          prev.map(a => (a.activity_id === activityId ? { ...a, rating: a.rating ?? null } : a))
        );
        alert(data.message || 'Failed to save rating.');
      }
    } catch (err) {
      console.error('Rate error:', err);
      alert('An error occurred while saving rating.');
    }
  };

  const renderRatingButtons = (activity: Activity) => {
    const current = activity.rating ?? 0;
    const buttons = [];
    for (let i = 1; i <= 5; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handleRate(activity.activity_id, i)}
          style={{
            marginRight: '6px',
            padding: '6px 8px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: current === i ? '700' : '400',
            backgroundColor: current === i ? '#2e7d32' : '#e6e6e6',
            color: current === i ? 'white' : '#333',
            minWidth: '34px',
          }}
        >
          {i}
        </button>
      );
    }
    return <div style={{ display: 'flex', alignItems: 'center' }}>{buttons}</div>;
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#c9edb6',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        color: '#4f4f4f',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Your Substitution Activity (last 3 months)</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <Input
          type="text"
          placeholder="Filter by ingredient (client-side)"
          onChange={(e) => {
            const q = e.target.value.toLowerCase();
            if (!q) {
              fetchActivities();
              return;
            }
            setActivities(prev => prev.filter(a => 
              a.original_name.toLowerCase().includes(q) || a.substitute_name.toLowerCase().includes(q)
            ));
          }}
          style={{
            flex: 1,
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #a2a2a2',
            backgroundColor: '#b0b0b0',
            color: 'white',
          }}
        />
        <Button
          onClick={fetchActivities}
          style={{
            padding: '8px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '6px',
            fontSize: '14px',
            height: '36px',
            border: 'none',
          }}
        >
          Refresh
        </Button>
      </div>

      <div
        style={{
          padding: '20px',
          borderRadius: '6px',
          boxShadow: '0 0 5px rgba(0,0,0,0.1)',
          border: '1px solid #a2a2a2',
          backgroundColor: '#b0b0b0',
          color: '#4f4f4f',
          minHeight: '120px',
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading...</p>
        ) : error ? (
          <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
        ) : activities.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No activity in the past 3 months</p>
        ) : (
          activities.map((act) => (
            <div
              key={act.activity_id}
              style={{
                marginBottom: '12px',
                padding: '12px',
                backgroundColor: '#ffffff20',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>
                  {act.original_name} → {act.substitute_name}
                </div>
                <div style={{ fontSize: '13px', marginBottom: '6px' }}>
                  Criteria: <span style={{ fontStyle: 'italic' }}>{act.criteria}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#333' }}>
                  Searched at: {new Date(act.created_at).toLocaleString()}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{ fontSize: '13px', marginBottom: '6px' }}>Your rating</div>
                {renderRatingButtons(act)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
