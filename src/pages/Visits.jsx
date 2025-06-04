import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';


const Visits = () => {
    const { user } = useContext(AuthContext);
    const [visits, setVisits] = useState([]);
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        visit_date: '',
        status: ''
    });

    useEffect(() => {
        fetchVisits();
    }, []);

    const fetchVisits = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/visits', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVisits(response.data);
        } catch (error) {
            showToast('Error fetching visits');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/visits', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchVisits();
            setFormData({
                patient_id: '',
                doctor_id: '',
                visit_date: '',
                status: ''
            });
            showToast('Visit created successfully');
        } catch (error) {
            showToast('Error creating visit');
        }
    };

    const showToast = (message) => {
        alert(message); // Placeholder for toast
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Visits</h2>
            {user.role === 'registrar' && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <input name="patient_id" value={formData.patient_id} onChange={handleChange} placeholder="Patient ID" className="border p-2 mr-2" />
                    <input name="doctor_id" value={formData.doctor_id} onChange={handleChange} placeholder="Doctor ID" className="border p-2 mr-2" />
                    <input name="visit_date" value={formData.visit_date} onChange={handleChange} placeholder="Visit Date (YYYY-MM-DD)" className="border p-2 mr-2" />
                    <input name="status" value={formData.status} onChange={handleChange} placeholder="Status" className="border p-2 mr-2" />
                    <button type="submit" className="bg-blue-500 text-white p-2">Create</button>
                </form>
            )}
            <ul>
                {visits.map((visit) => (
                    <li key={visit.ID} className="mb-2">
                        Patient ID: {visit.patient_id} - Doctor ID: {visit.doctor_id} - {visit.visit_date}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Visits;