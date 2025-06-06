import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Visits = () => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        date: '',
        complaints: '',
        diagnosis: '',
        prescription: '',
        sick_leave: false
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchPatients();
        fetchDoctors();
    }, []);

    const fetchPatients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/patients', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatients(response.data);
        } catch (error) {
            console.error('Fetch patients error:', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/doctors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(response.data);
        } catch (error) {
            console.error('Fetch doctors error:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patient_id || !formData.doctor_id || !formData.date) {
            setError('Пожалуйста, заполните обязательные поля');
            return;
        }
        const submitData = {
            patient_id: parseInt(formData.patient_id, 10) || null,
            doctor_id: parseInt(formData.doctor_id, 10) || null,
            date: formData.date,
            complaints: formData.complaints,
            diagnosis: formData.diagnosis,
            prescription: formData.prescription,
            sick_leave: formData.sick_leave
        };
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/visits', submitData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({
                patient_id: '',
                doctor_id: '',
                date: '',
                complaints: '',
                diagnosis: '',
                prescription: '',
                sick_leave: false
            });
            setError('');
            showToast('Посещение добавлено успешно');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Ошибка при добавлении посещения: ${errorMsg}`);
            console.error('Post error:', error);
        }
    };

    const showToast = (message) => {
        alert(message);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Посещения</h2>
            {user?.role === 'registrar' && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Добавить посещение</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            name="patient_id"
                            value={formData.patient_id}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        >
                            <option value="">Выберите пациента</option>
                            {patients.map((patient) => (
                                <option key={patient.ID} value={patient.ID}>
                                    {patient.full_name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        >
                            <option value="">Выберите врача</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.ID} value={doctor.ID}>
                                    {doctor.full_name}
                                </option>
                            ))}
                        </select>
                        <input
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="complaints"
                            value={formData.complaints}
                            onChange={handleChange}
                            placeholder="Жалобы"
                            className="border p-2 rounded"
                        />
                        <input
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            placeholder="Диагноз"
                            className="border p-2 rounded"
                        />
                        <input
                            name="prescription"
                            value={formData.prescription}
                            onChange={handleChange}
                            placeholder="Назначения"
                            className="border p-2 rounded"
                        />
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="sick_leave"
                                checked={formData.sick_leave}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Больничный
                        </label>
                        <div className="col-span-2">
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                Добавить
                            </button>
                        </div>
                    </form>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                </div>
            )}
            {/* Здесь можно добавить отображение списка посещений */}
        </div>
    );
};

export default Visits;