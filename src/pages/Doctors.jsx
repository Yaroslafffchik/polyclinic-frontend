import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import DoctorCard from './DoctorCard';

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
            setError(`Ошибка при загрузке врачей: ${errorMsg}`);
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
            showToast('Врач создан успешно');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Ошибка при создании врача: ${errorMsg}`);
            console.error('Post error:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить врача?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/doctors/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchDoctors();
                showToast('Врач удален успешно');
            } catch (error) {
                const errorMsg = error.response?.data?.error || error.message;
                setError(`Ошибка при удалении врача: ${errorMsg}`);
                console.error('Delete error:', error);
            }
        }
    };

    const showToast = (message) => {
        alert(message);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Врачи</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {user?.role === 'registrar' && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Создать врача</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="ФИО"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            placeholder="Категория"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleChange}
                            placeholder="Дата рождения (ГГГГ-ММ-ДД)"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            placeholder="Специализация"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            placeholder="Стаж"
                            type="number"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="section_id"
                            value={formData.section_id}
                            onChange={handleChange}
                            placeholder="ID участка"
                            type="number"
                            className="border p-2 rounded"
                            required
                        />
                        <div className="col-span-2">
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                Создать
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {doctors.length > 0 ? (
                    doctors.map((doctor) => (
                        <DoctorCard
                            key={doctor.id}
                            doctor={doctor}
                            onDelete={handleDelete}
                            role={user?.role}
                        />
                    ))
                ) : (
                    <p>Врачи не найдены</p>
                )}
            </div>
        </div>
    );
};

export default Doctors;