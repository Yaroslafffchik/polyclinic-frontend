import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import DoctorCard from './DoctorCard';

const Doctors = () => {
    const { user } = useContext(AuthContext);
    const [doctors, setDoctors] = useState([]);
    const [sections, setSections] = useState([]);
    const [formData, setFormData] = useState({
        last_name: '',
        first_name: '',
        middle_name: '',
        category: '',
        birth_date: '',
        specialization: '',
        experience: '',
        section_ids: []
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDoctors();
        fetchSections();
    }, []);

    const fetchDoctors = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/doctors', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDoctors(response.data);
            setError('');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Ошибка при загрузке врачей: ${errorMsg}`);
        }
    };

    const fetchSections = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/sections', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSections(response.data);
        } catch (error) {
            console.error('Fetch sections error:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSectionChange = (sectionId) => {
        let newSectionIds = [...formData.section_ids];
        if (newSectionIds.includes(sectionId)) {
            newSectionIds = newSectionIds.filter(id => id !== sectionId);
        } else {
            newSectionIds.push(sectionId);
        }
        setFormData({ ...formData, section_ids: newSectionIds });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = {
            last_name: formData.last_name,
            first_name: formData.first_name,
            middle_name: formData.middle_name,
            category: formData.category,
            birth_date: formData.birth_date,
            specialization: formData.specialization,
            experience: parseInt(formData.experience, 10) || 0,
            section_ids: formData.section_ids.map(id => parseInt(id, 10))
        };
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/doctors', submitData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchDoctors();
            setFormData({
                last_name: '',
                first_name: '',
                middle_name: '',
                category: '',
                birth_date: '',
                specialization: '',
                experience: '',
                section_ids: []
            });
            setError('');
            alert('Врач создан успешно');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Ошибка при создании врача: ${errorMsg}`);
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
                alert('Врач удален успешно');
            } catch (error) {
                const errorMsg = error.response?.data?.error || error.message;
                setError(`Ошибка при удалении врача: ${errorMsg}`);
            }
        }
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
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Фамилия"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Имя"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="middle_name"
                            value={formData.middle_name}
                            onChange={handleChange}
                            placeholder="Отчество"
                            className="border p-2 rounded"
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
                        <div>
                            <label className="block text-gray-700 mb-2">Участки:</label>
                            <div className="flex flex-wrap gap-2">
                                {sections.map((section) => (
                                    <label key={section.ID} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.section_ids.includes(section.ID.toString())}
                                            onChange={() => handleSectionChange(section.ID.toString())}
                                            className="mr-2"
                                        />
                                        {section.name}
                                    </label>
                                ))}
                            </div>
                        </div>
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
                            key={doctor.ID}
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