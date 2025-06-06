import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchedulesBySpecialization = () => {
    const [specialization, setSpecialization] = useState('');
    const [schedules, setSchedules] = useState([]);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:8080/api/schedules/specialization/${specialization}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSchedules(response.data);
            setError('');
        } catch (error) {
            setError(`Ошибка при загрузке расписаний: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Расписания по специализации</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="mb-6">
                <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Введите специализацию"
                    className="border p-2 rounded mr-2"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Найти
                </button>
            </form>
            <div className="grid grid-cols-1 gap-4">
                {schedules.length > 0 ? (
                    schedules.map((schedule) => (
                        <div key={schedule.ID} className="bg-white p-4 rounded-lg shadow-md">
                            <p><strong>Врач:</strong> {schedule.Doctor?.last_name} {schedule.Doctor?.first_name}</p>
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

export default SchedulesBySpecialization;