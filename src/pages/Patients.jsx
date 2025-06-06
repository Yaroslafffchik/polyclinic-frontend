import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PatientCard from './PatientCard';

const Patients = () => {
    const { user } = useContext(AuthContext);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        full_name: '',
        address: '',
        gender: '',
        age: '',
        insurance_number: '',
        doctor_id: ''
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
            console.log('Fetched patients:', response.data);
            setPatients(response.data);
        } catch (error) {
            showToast('Ошибка при загрузке пациентов');
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
            age: parseInt(formData.age, 10) || 0,
            doctor_id: parseInt(formData.doctor_id, 10) || 0
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
                insurance_number: '',
                doctor_id: ''
            });
            showToast(editPatientId ? 'Пациент обновлен успешно' : 'Пациент создан успешно');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            showToast(`Ошибка при сохранении пациента: ${errorMsg}`);
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
            insurance_number: patient.insurance_number || '',
            doctor_id: (patient.DoctorID || '').toString()
        });
    };

    const showToast = (message) => {
        alert(message);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Пациенты</h2>
            {user?.role === 'registrar' && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">{editPatientId ? 'Редактировать пациента' : 'Создать пациента'}</h3>
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
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Адрес"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            placeholder="Пол (М/Ж)"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            placeholder="Возраст"
                            type="number"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="insurance_number"
                            value={formData.insurance_number}
                            onChange={handleChange}
                            placeholder="Номер полиса"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="doctor_id"
                            value={formData.doctor_id}
                            onChange={handleChange}
                            placeholder="ID врача"
                            type="number"
                            className="border p-2 rounded"
                            required
                        />
                        <div className="col-span-2 flex space-x-2">
                            <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                                {editPatientId ? 'Обновить' : 'Создать'}
                            </button>
                            {editPatientId && (
                                <button
                                    type="button"
                                    onClick={() => setEditPatientId(null)}
                                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                                >
                                    Отмена
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.length > 0 ? (
                    patients.map((patient) => (
                        <PatientCard
                            key={patient.ID}
                            patient={patient}
                            onEdit={handleEdit}
                            role={user?.role}
                        />
                    ))
                ) : (
                    <p>Пациенты не найдены</p>
                )}
            </div>
        </div>
    );
};

export default Patients;