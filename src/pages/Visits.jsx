import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Visits = () => {
    const { user } = useContext(AuthContext);
    const [visits, setVisits] = useState([]);
    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        date: '',
        complaints: '',
        diagnosis: '',
        prescription: '',
        sick_leave: false
    });
    const [loading, setLoading] = useState(true);

    const fetchVisits = async () => {
        try {
            if (!user) {
                setLoading(false);
                return;
            }
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/visits', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Fetched visits:', response.data);
            setVisits(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisits();
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Пожалуйста, войдите, чтобы создать посещение');
            return;
        }
        const submitData = {
            ...formData,
            patient_id: parseInt(formData.patient_id, 10) || 0,
            doctor_id: parseInt(formData.doctor_id, 10) || 0,
            sick_leave: formData.sick_leave === 'true' || formData.sick_leave === true
        };
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/api/visits', submitData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchVisits();
            setFormData({
                patient_id: '',
                doctor_id: '',
                date: '',
                complaints: '',
                diagnosis: '',
                prescription: '',
                sick_leave: false
            });
            alert('Посещение создано успешно');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            alert(`Ошибка при создании посещения: ${errorMsg}`);
            console.error('Post error:', error);
        }
    };

    if (loading) {
        return <div className="p-4">Загрузка...</div>;
    }

    if (!user) {
        return <div className="p-4">Пожалуйста, войдите, чтобы просмотреть посещения</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Посещения</h2>
            {(user.role === 'registrar' || user.role === 'doctor') && (
                <form onSubmit={handleSubmit} className="mb-4">
                    <input
                        name="patient_id"
                        value={formData.patient_id}
                        onChange={handleChange}
                        placeholder="ID пациента"
                        type="number"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="doctor_id"
                        value={formData.doctor_id}
                        onChange={handleChange}
                        placeholder="ID врача"
                        type="number"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="Дата (ГГГГ-ММ-ДД)"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="complaints"
                        value={formData.complaints}
                        onChange={handleChange}
                        placeholder="Жалобы"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="diagnosis"
                        value={formData.diagnosis}
                        onChange={handleChange}
                        placeholder="Диагноз"
                        className="border p-2 mr-2"
                        required
                    />
                    <input
                        name="prescription"
                        value={formData.prescription}
                        onChange={handleChange}
                        placeholder="Назначения"
                        className="border p-2 mr-2"
                        required
                    />
                    <label className="mr-2">
                        Больничный:
                        <input
                            name="sick_leave"
                            type="checkbox"
                            checked={formData.sick_leave}
                            onChange={handleChange}
                            className="ml-2"
                        />
                    </label>
                    <button type="submit" className="bg-blue-500 text-white p-2">
                        Создать
                    </button>
                </form>
            )}
            <ul>
                {visits.length > 0 ? (
                    visits.map((visit) => (
                        <li key={visit.ID} className="mb-2">
                            ID пациента: {visit.patient_id} - ID врача: {visit.doctor_id} - Дата: {visit.date}
                        </li>
                    ))
                ) : (
                    <li>Посещения не найдены</li>
                )}
            </ul>
        </div>
    );
};

export default Visits;