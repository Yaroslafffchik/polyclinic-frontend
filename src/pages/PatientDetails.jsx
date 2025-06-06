import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import patientPhoto from '../photos/patient.png';

const PatientDetails = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:8080/api/patients/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatient(response.data.patient);
                setVisits(response.data.visits);
                setLoading(false);
            } catch (err) {
                setError('Ошибка при загрузке данных пациента');
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    if (loading) {
        return <div className="p-4">Загрузка...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    if (!patient) {
        return <div className="p-4">Пациент не найден</div>;
    }

    const lastVisit = visits.length > 0 ? visits.reduce((latest, visit) => {
        return new Date(visit.date) > new Date(latest.date) ? visit : latest;
    }) : null;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Информация о пациенте</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="flex items-center mb-4">
                    <img
                        src={patientPhoto}
                        alt={`Фото пациента ${patient.full_name}`}
                        className="w-24 h-24 rounded-full mr-4"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{patient.full_name}</h2>
                        <p className="text-gray-600">Возраст: {patient.age} лет</p>
                        <p className="text-gray-600">Пол: {patient.gender === 'M' ? 'Мужской' : 'Женский'}</p>
                    </div>
                </div>
                <p><strong>Адрес:</strong> {patient.address}</p>
                <p><strong>Номер полиса:</strong> {patient.insurance_number}</p>
                <p><strong>Дата создания карточки:</strong> {new Date(patient.CreatedAt).toLocaleDateString('ru-RU')}</p>
                <p><strong>Лечащий врач:</strong> {patient.Doctor ? patient.Doctor.full_name : 'Не назначен'}</p>
                {lastVisit && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Последнее посещение</h3>
                        <p><strong>Дата:</strong> {lastVisit.date}</p>
                        <p><strong>Диагноз:</strong> {lastVisit.diagnosis}</p>
                    </div>
                )}
            </div>

            <h2 className="text-xl font-bold mb-4">История посещений</h2>
            {visits.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {visits.map((visit) => (
                        <div key={visit.ID} className="bg-white p-4 rounded-lg shadow-md">
                            <p><strong>Дата:</strong> {visit.date}</p>
                            <p><strong>Жалобы:</strong> {visit.complaints}</p>
                            <p><strong>Диагноз:</strong> {visit.diagnosis}</p>
                            <p><strong>Назначения:</strong> {visit.prescription}</p>
                            <p><strong>Больничный:</strong> {visit.sick_leave ? 'Да' : 'Нет'}</p>
                            <p><strong>Врач:</strong> {visit.Doctor ? visit.Doctor.full_name : 'Неизвестно'}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Посещения отсутствуют</p>
            )}
        </div>
    );
};

export default PatientDetails;