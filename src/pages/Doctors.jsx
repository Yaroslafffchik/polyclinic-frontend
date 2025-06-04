import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Doctors = () => {
    const { user } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        full_name: '',
        category: '',
        birth_date: '',
        specialization: '',
        experience: '',
        section_id: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/doctors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Fetched doctors:', response.data);
            setDoctors(response.data);
            setError('');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Error fetching doctors: ${errorMsg}`);
            console.error('Fetch error:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = {
            ...formData,
            experience: parseInt(formData.experience, 10) || 0,
            section_id: parseInt(formData.section_id, 10) || 0
        };
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/api/doctors', submitData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Post response:', response.data);
            fetchDoctors();
            setFormData({
                full_name: '',
                category: '',
                birth_date: '',
                specialization: '',
                experience: '',
                section_id: ''
            });
            setError('');
            showToast('Doctor created successfully');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Error creating doctor: ${errorMsg}`);
            console.error('Post error:', error);
        }
    };

    const showToast = (message) => {
        alert(message);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Doctors</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {user?.role === 'registrar' && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <input
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Category"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        placeholder="Birth Date (YYYY-MM-DD)"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleChange}
                        placeholder="Specialization"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        placeholder="Experience"
                        type="number"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="section_id"
                        value={formData.section_id}
                        onChange={handleChange}
                        placeholder="Section ID"
                        type="number"
                        className="border p-2 mr-2"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2">
                        Create
                    </button>
                </form>
            )}
            <ul>
                {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <li key={doctor.id} className="mb-2">
                            {doctor.full_name} - {doctor.category} - {doctor.birth_date} - {doctor.specialization} - {doctor.experience} yrs - Section ID: {doctor.section_id}
                        </li>
                    ))
                ) : (
                    <li>No doctors found</li>
                )}
            </ul>
        </div>
    );
};

export default Doctors;