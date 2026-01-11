import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { User, Phone, Mail, MapPin, Award, Edit2, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const { user: authUser, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        username: '',
        phone: '',
        email: '',
        points: 0,
        total_spent: 0,
        total_orders: 0
    });
    const [editedProfile, setEditedProfile] = useState({ ...profile });

    useEffect(() => {
        if (authUser) {
            fetchProfile();
        }
    }, [authUser]);

    const fetchProfile = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/profile/${authUser.id}`);
            const data = await response.json();

            if (response.ok) {
                setProfile(data.user);
                setEditedProfile(data.user);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/profile/${authUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: editedProfile.username,
                    email: editedProfile.email,
                    phone: editedProfile.phone
                }),
            });

            if (response.ok) {
                setProfile(editedProfile);
                // Update auth context with new user data
                updateUser({
                    ...authUser,
                    username: editedProfile.username,
                    email: editedProfile.email,
                    phone: editedProfile.phone
                });
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    const handleCancel = () => {
        setEditedProfile({ ...profile });
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setEditedProfile({ ...editedProfile, [field]: value });
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="container section">
                    <p>Loading profile...</p>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container section">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <User size={60} />
                    </div>
                    <h2 className="profile-name">{profile.username}</h2>
                    <div className="points-badge">
                        <Award size={20} />
                        <span>{profile.points} Points</span>
                    </div>
                </div>

                <div className="profile-content">
                    <div className="profile-actions">
                        {!isEditing ? (
                            <button className="btn btn-primary" onClick={handleEdit}>
                                <Edit2 size={18} /> Edit Profile
                            </button>
                        ) : (
                            <div className="edit-actions">
                                <button className="btn btn-primary" onClick={handleSave}>
                                    <Save size={18} /> Save Changes
                                </button>
                                <button className="btn btn-outline" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="profile-details card">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <User size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Username</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={editedProfile.username}
                                        onChange={(e) => handleChange('username', e.target.value)}
                                        className="form-input"
                                    />
                                ) : (
                                    <p>{profile.username}</p>
                                )}
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <Phone size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={editedProfile.phone}
                                        onChange={(e) => handleChange('phone', e.target.value)}
                                        className="form-input"
                                    />
                                ) : (
                                    <p>{profile.phone}</p>
                                )}
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <Mail size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={editedProfile.email}
                                        onChange={(e) => handleChange('email', e.target.value)}
                                        className="form-input"
                                    />
                                ) : (
                                    <p>{profile.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <Award size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Total Orders</label>
                                <p>{profile.total_orders} orders</p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <Award size={20} />
                            </div>
                            <div className="detail-content">
                                <label>Total Spent</label>
                                <p>Ksh {profile.total_spent?.toLocaleString() || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
