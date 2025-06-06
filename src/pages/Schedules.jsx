import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Schedules = () => {
    const { user } = useContext(AuthContext);
    const [schedules, setSchedules] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [sections, setSections] = useState([]);
    const [formData, setFormData] = useState({
        doctor_id: '',
        section_id: '',
        selectedDays: [],
        time: '',
        room: ''
    });
    const [error, setError] = useState('');

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

    useEffect(() => {
        fetchSchedules();
        fetchDoctors();
        fetchSections();
    }, []);

    const fetchSchedules = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8080/api/schedules', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedules(response.data);
            setError('');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Ошибка при загрузке расписаний: ${errorMsg}`);
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
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleDayChange = (day) => {
        let newSelectedDays = [...formData.selectedDays];
        if (newSelectedDays.includes(day)) {
            newSelectedDays = newSelectedDays.filter(d => d !== day);
        } else {
            if (newSelectedDays.length < 3) {
                newSelectedDays.push(day);
            } else {
                alert('Нельзя выбрать более 3 дней в неделю');
                return;
            }
        }
        setFormData({ ...formData, selectedDays: newSelectedDays });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.doctor_id || !formData.section_id || formData.selectedDays.length === 0 || !formData.time || !formData.room) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }
        const submitData = {
            doctor_id: parseInt(formData.doctor_id, 10) || null,
            section_id: parseInt(formData.section_id, 10) || null,
            days: formData.selectedDays.join(', '),
            time: formData.time,
            room: formData.room
        };
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/schedules', submitData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSchedules();
            setFormData({
                doctor_id: '',
                section_id: '',
                selectedDays: [],
                time: '',
                room: ''
            });
            setError('');
            alert('Расписание создано успешно');
        } catch (error) {
            const errorMsg = error.response?.data?.error || error.message;
            setError(`Ошибка при создании расписания: ${errorMsg}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Расписания</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {user?.role === 'registrar' && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Создать расписание</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
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
                        <select
                            name="section_id"
                            value={formData.section_id}
                            onChange={handleChange}
                            className="border p-2 rounded"
                            required
                        >
                            <option value="">Выберите участок</option>
                            {sections.map((section) => (
                                <option key={section.ID} value={section.ID}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                        <div>
                            <label className="block text-gray-700 mb-2">Выберите дни (не более 3):</label>
                            <div className="flex flex-wrap gap-2">
                                {daysOfWeek.map((day) => (
                                    <label key={day} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.selectedDays.includes(day)}
                                            onChange={() => handleDayChange(day)}
                                            className="mr-2"
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <input
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            placeholder="Время (например, 09:00-17:00)"
                            className="border p-2 rounded"
                            required
                        />
                        <input
                            name="room"
                            value={formData.room}
                            onChange={handleChange}
                            placeholder="Кабинет"
                            className="border p-2 rounded"
                            required
                        />
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                            Создать
                        </button>
                    </form>
                </div>
            )}
            <div className="grid grid-cols-1 gap-4">
                {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <div key={schedule.ID} className="bg-white p-4 rounded-lg shadow-md">
                            <p><strong>Врач:</strong> {schedule.Doctor?.full_name || 'Неизвестно'}</p>
                            <p><strong>Участок:</strong> {schedule.Section?.name || 'Не указан'}</p>
                            <p><strong>Дни:</strong> {schedule.days}</p>
                            <p><strong>Время:</strong> {schedule.time}</p>
                            <p><strong>Кабинет:</strong> {schedule.room}</p>
                        </div>
                    ))
                ) : (
                    <p>Расписания не найдены</p>
                )}
            </div>
        </div>
    );
};

export default Schedules;