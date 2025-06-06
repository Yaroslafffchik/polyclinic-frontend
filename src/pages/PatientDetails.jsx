import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import patientPhoto from '../photos/patient.png';

const PatientDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [patient, setPatient] = useState(null);
    const [visits, setVisits] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [visitForm, setVisitForm] = useState({
        patient_id: Number(id),
        doctor_id: '',
        date: '',
        complaints: '',
        diagnosis: '',
        prescription: '',
        sick_leave: false,
        sick_leave_duration: 0
    });
    const [patientForm, setPatientForm] = useState({
        last_name: '',
        first_name: '',
        middle_name: '',
        address: '',
        gender: '',
        age: '',
        insurance_number: '',
        doctor_id: ''
    });

    useEffect(() => {
        fetchPatient();
        fetchDoctors();
    }, [id]);

    const fetchPatient = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/patients/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPatient(response.data.patient);
            setVisits(response.data.visits);
            setPatientForm({
                last_name: response.data.patient.last_name || '',
                first_name: response.data.patient.first_name || '',
                middle_name: response.data.patient.middle_name || '',
                address: response.data.patient.address || '',
                gender: response.data.patient.gender || '',
                age: response.data.patient.age?.toString() || '',
                insurance_number: response.data.patient.insurance_number || '',
                doctor_id: response.data.patient.DoctorID?.toString() || ''
            });
            setLoading(false);
        } catch (err) {
            setError('Ошибка при загрузке данных пациента');
            setLoading(false);
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

    const handlePatientChange = (e) => {
        setPatientForm({ ...patientForm, [e.target.name]: e.target.value });
    };

    const handleVisitChange = (e) => {
        const { name, value, type, checked } = e.target;
        setVisitForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'sick_leave_duration' ? parseInt(value) || 0 : value)
        }));
    };

    const handlePatientSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                ...patientForm,
                age: parseInt(patientForm.age), // Преобразуем age в число
                doctor_id: Number(patientForm.doctor_id) || 0 // Преобразуем doctor_id в число
            };
            await axios.put(`http://localhost:8080/api/patients/${id}`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPatient();
            setEditMode(false);
            alert('Пациент обновлен успешно');
        } catch (error) {
            setError(`Ошибка при обновлении пациента: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleVisitSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const dataToSend = {
                ...visitForm,
                patient_id: Number(visitForm.patient_id),
                doctor_id: Number(visitForm.doctor_id),
                sick_leave_duration: Number(visitForm.sick_leave_duration) || 0
            };
            await axios.post('http://localhost:8080/api/visits', dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPatient();
            setVisitForm({
                patient_id: Number(id),
                doctor_id: '',
                date: '',
                complaints: '',
                diagnosis: '',
                prescription: '',
                sick_leave: false,
                sick_leave_duration: 0
            });
            alert('Посещение добавлено успешно');
        } catch (error) {
            setError(`Ошибка при добавлении посещения: ${error.response?.data?.error || error.message}`);
        }
    };

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
            {editMode && user?.role !== 'patient' ? (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Редактировать пациента</h3>
                    <form onSubmit={handlePatientSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="last_name"
                            value={patientForm.last_name}
                            onChange={handlePatientChange}
                            placeholder="Фамилия"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="first_name"
                            value={patientForm.first_name}
                            onChange={handlePatientChange}
                            placeholder="Имя"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="middle_name"
                            value={patientForm.middle_name}
                            onChange={handlePatientChange}
                            placeholder="Отчество"
                            className="border p-2 rounded"
                        />
                        <input
                            name="address"
                            value={patientForm.address}
                            onChange={handlePatientChange}
                            placeholder="Адрес"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="gender"
                            value={patientForm.gender}
                            onChange={handlePatientChange}
                            placeholder="Пол (М/Ж)"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="age"
                            value={patientForm.age}
                            onChange={handlePatientChange}
                            placeholder="Возраст"
                            type="number"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="insurance_number"
                            value={patientForm.insurance_number}
                            onChange={handlePatientChange}
                            placeholder="Номер полиса"
                            className="border p-2 rounded"
                            required
                        />
                        <select
                            name="doctor_id"
                            value={patientForm.doctor_id}
                            onChange={handlePatientChange}
                            className="border p-2 rounded"
                        >
                            <option value="0">Не назначен</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.ID} value={doctor.ID}>
                                    {`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name || ''}`}
                                </option>
                            ))}
                        </select>
                        <div className="col-span-2 flex space-x-2">
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                Обновить
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditMode(false)}
                                className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                            >
                                Отмена
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex items-center mb-4">
                        <img
                            src={patientPhoto}
                            alt={`Фото пациента ${patient.last_name} ${patient.first_name}`}
                            className="w-24 h-24 rounded-full mr-4"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">{`${patient.last_name} ${patient.first_name} ${patient.middle_name || ''}`.trim()}</h2>
                            <p className="text-gray-600">Возраст: {patient.age} лет</p>
                            <p className="text-gray-600">Пол: {patient.gender === 'M' ? 'Мужской' : 'Женский'}</p>
                        </div>
                    </div>
                    <p><strong>Адрес:</strong> {patient.address}</p>
                    <p><strong>Номер полиса:</strong> {patient.insurance_number}</p>
                    <p><strong>Дата создания карточки:</strong> {new Date(patient.card_created_at).toLocaleDateString('ru-RU')}</p>
                    <p><strong>Лечащий врач:</strong> {patient.Doctor ? `${patient.Doctor.last_name} ${patient.Doctor.first_name} ${patient.Doctor.middle_name || ''}`.trim() : 'Не назначен'}</p>
                    {lastVisit && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Последнее посещение</h3>
                            <p><strong>Дата:</strong> {lastVisit.date}</p>
                            <p><strong>Диагноз:</strong> {lastVisit.diagnosis}</p>
                        </div>
                    )}
                    {(user?.role === 'registrar' || user?.role === 'doctor') && (
                        <button
                            onClick={() => setEditMode(true)}
                            className="mt-4 bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                        >
                            Редактировать
                        </button>
                    )}
                </div>
            )}

            {(user?.role === 'registrar' || user?.role === 'doctor') && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Добавить посещение</h3>
                    <form onSubmit={handleVisitSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            name="doctor_id"
                            value={visitForm.doctor_id}
                            onChange={handleVisitChange}
                            className="border p-2 rounded"
                            required
                        >
                            <option value="">Выберите врача</option>
                            {doctors.map((doctor) => (
                                <option key={doctor.ID} value={doctor.ID}>
                                    {`${doctor.last_name} ${doctor.first_name} ${doctor.middle_name || ''}`}
                                </option>
                            ))}
                        </select>
                        <input
                            name="date"
                            type="date"
                            value={visitForm.date}
                            onChange={handleVisitChange}
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="complaints"
                            value={visitForm.complaints}
                            onChange={handleVisitChange}
                            placeholder="Жалобы"
                            className="border p-2 rounded"
                        />
                        <input
                            name="diagnosis"
                            value={visitForm.diagnosis}
                            onChange={handleVisitChange}
                            placeholder="Диагноз"
                            className="border p-2 rounded"
                        />
                        <input
                            name="prescription"
                            value={visitForm.prescription}
                            onChange={handleVisitChange}
                            placeholder="Назначения"
                            className="border p-2 rounded"
                        />
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="sick_leave"
                                checked={visitForm.sick_leave}
                                onChange={handleVisitChange}
                                className="mr-2"
                            />
                            Больничный
                        </label>
                        {visitForm.sick_leave && (
                            <input
                                type="number"
                                name="sick_leave_duration"
                                value={visitForm.sick_leave_duration}
                                onChange={handleVisitChange}
                                placeholder="Срок больничного (дни)"
                                className="border p-2 rounded"
                                min="1"
                                required
                            />
                        )}
                        <div className="col-span-2">
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                Добавить
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <h2 className="text-xl font-bold mb-4">История посещений</h2>
            {visits.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {visits.map((visit) => (
                        <div key={visit.ID} className="bg-white p-4 rounded-lg shadow-md">
                            <p><strong>Дата:</strong> {visit.date}</p>
                            <p><strong>Жалобы:</strong> {visit.complaints}</p>
                            <p><strong>Диагноз:</strong> {visit.diagnosis}</p>
                            <p><strong>Назначения:</strong> {visit.prescription}</p>
                            <p><strong>Больничный:</strong> {visit.sick_leave ? `Да (${visit.sick_leave_duration} дней)` : 'Нет'}</p>
                            <p><strong>Врач:</strong> {visit.Doctor ? `${visit.Doctor.last_name} ${visit.Doctor.first_name} ${visit.Doctor.middle_name || ''}`.trim() : 'Неизвестно'}</p>
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