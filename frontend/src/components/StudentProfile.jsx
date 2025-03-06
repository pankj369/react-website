import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import './StudentProfile.css';

const StudentProfile = () => {
    const [profile, setProfile] = useState({
        fullname: '',
        email: '',
        contact: '',
        batch: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({ type: 'danger', text: 'Error fetching profile' });
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/auth/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'danger', text: 'Error updating profile' });
        }
    };

    return (
        <div className="student-profile">
            <Card>
                <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>My Profile</h5>
                        <Button 
                            variant={isEditing ? "secondary" : "primary"}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {message.text && (
                        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
                            {message.text}
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="fullname"
                                value={profile.fullname}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contact</Form.Label>
                            <Form.Control
                                type="text"
                                name="contact"
                                value={profile.contact}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Batch</Form.Label>
                            <Form.Control
                                type="text"
                                name="batch"
                                value={profile.batch}
                                onChange={handleChange}
                                disabled={!isEditing}
                            />
                        </Form.Group>

                        {isEditing && (
                            <Button variant="primary" type="submit">
                                Save Changes
                            </Button>
                        )}
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default StudentProfile;