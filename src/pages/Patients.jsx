// src/pages/Patients.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Patients = () => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        full_name: '',
        address: '',
        gender: '',
        age: '',
        insurance_number: ''
    });
    const [editPatientId, setEditPatientId] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/patients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Fetched patients:', response.data); // Лог для отладки
            setPatients(response.data);
        } catch (error) {
            showToast('Error fetching patients');
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
            age: parseInt(formData.age, 10) || 0
        };
        try {
            const token = localStorage.getItem('token');
            if (editPatientId) {
                await axios.put(`http://localhost:8080/api/patients/${editPatientId}`, submitData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setEditPatientId(null);
            } else {
                await axios.post('http://localhost:8080/api/patients', submitData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchPatients();
            setFormData({
                full_name: '',
                address: '',
                gender: '',
                age: '',
                insurance_number: ''
            });
            showToast(editPatientId ? 'Patient updated successfully' : 'Patient created successfully');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            showToast(`Error saving patient: ${errorMsg}`);
            console.error('Post error:', error);
        }
    };

    const handleEdit = (patient) => {
        setEditPatientId(patient.ID);
        setFormData({
            full_name: patient.full_name || '',
            address: patient.address || '',
            gender: patient.gender || '',
            age: (patient.age || '').toString(),
            insurance_number: patient.insurance_number || ''
        });
    };

    const showToast = (message) => {
        alert(message);
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Patients</h2>
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
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        placeholder="Gender (M/F)"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        placeholder="Age"
                        type="number"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="insurance_number"
                        value={formData.insurance_number}
                        onChange={handleChange}
                        placeholder="Insurance Number"
                        className="border p-2 mr-2"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2">
                        {editPatientId ? 'Update' : 'Create'}
                    </button>
                    {editPatientId && (
                        <button
                            type="button"
                            onClick={() => setEditPatientId(null)}
                            className="bg-red-500 text-white p-2 ml-2"
                        >
                            Cancel
                        </button>
                    )}
                </form>
            )}
            <ul>
                {patients.length > 0 ? (
                    patients.map((patient) => (
                        <li key={patient.ID} className="mb-2">
                            {patient.full_name} - {patient.age} yrs
                            {user?.role === 'registrar' && (
                                <button
                                    onClick={() => handleEdit(patient)}
                                    className="bg-yellow-500 text-white p-1 ml-2"
                                >
                                    Edit
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <li>No patients found</li>
                )}
            </ul>
        </div>
    );
};

export default Patients;