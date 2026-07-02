// ============================================================================
// PAGE: Profile
// ============================================================================
// What this file does:
// Renders the User Profile dashboard. Rather than relying solely on cached data in
// localStorage, it queries the backend profile GET endpoint to fetch fresh details,
// ensuring the user's name, email, and registration timestamps are accurate.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { authService } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch user data from /api/auth/profile
        const data = await authService.getProfile();
        setProfile(data.user);
        
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-secondary)' }}>
        <h3>Loading profile...</h3>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>User Profile</h2>
      
      {error && <div className="alert-bar alert-danger">{error}</div>}

      {profile && (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Avatar Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              color: '#ffffff',
              boxShadow: '0 4px 15px var(--accent-glow)'
            }}>
              👤
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem' }}>{profile.name}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Registered Member</p>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />

          {/* Details list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Name */}
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Full Name
              </span>
              <p style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.name}</p>
            </div>

            {/* Email */}
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Email Address
              </span>
              <p style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>{profile.email}</p>
            </div>

            {/* Joined Timestamp */}
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Account Created
              </span>
              <p style={{ fontSize: '1.1rem', marginTop: '0.25rem' }}>
                {new Date(profile.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
