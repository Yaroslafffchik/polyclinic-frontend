import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DoctorDetails = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/doctors/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctor(response.data.doctor);
                setSchedules(response.data.schedules);
                setPatients(response.data.patients);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке данных врача');
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    if (loading) {
        return <div className="p-4">Загрузка...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!doctor) {
        return <div className="p-4">Врач не найден</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Карточка врача</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center mb-4">
                    <img
                        src="https://via.placeholder.com/100"
                        alt={`Фото врача ${doctor.full_name}`}
                        className="w-24 h-24 rounded-full mr-4"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{doctor.full_name}</h2>
                        <p className="text-gray-600">Специализация: {doctor.specialization}</p>
                        <p className="text-gray-600">Категория: {doctor.category}</p>
                    </div>
                </div>
                <p><strong>Стаж:</strong> {doctor.experience} лет</p>
                <p><strong>Дата рождения:</strong> {doctor.birth_date}</p>
                <p><strong>Участок:</strong> {doctor.Section ? doctor.Section.name : 'Не назначен'}</p>
            </div>

            <h2 className="text-xl font-bold mb-4">Расписание</h2>
            {schedules.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 mb-6">
                    {schedules.map((schedule) => (
                        <div key={schedule.ID} className="bg-white p-4 rounded-lg shadow-md">
                            <p><strong>Дни:</strong> {schedule.Days}</p>
                            <p><strong>Время:</strong> {schedule.Time}</p>
                            <p><strong>Кабинет:</strong> {schedule.Room}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Расписания отсутствуют</p>
            )}

            <h2 className="text-xl font-bold mb-4">Пациенты врача</h2>
            {patients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {patients.map((patient) => (
                        <div key={patient.ID} className="bg-white p-4 rounded-lg shadow-md">
                            <p><strong>ФИО:</strong> {patient.full_name}</p>
                            <p><strong>Возраст:</strong> {patient.age} лет</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Пациенты отсутствуют</p>
            )}
        </div>
    );
};

export default DoctorDetails;