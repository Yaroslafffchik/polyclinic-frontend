import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Doctors = () => {
    const { user } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [sections, setSections] = useState([]);
    const [form, setForm] = useState({
        full_name: '',
        category: '',
        birth_date: '',
        specialization: '',
        experience: '',
        section_id: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/doctors');
                setDoctors(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch doctors');
            }
        };

        const fetchSections = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/sections');
                setSections(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch sections');
            }
        };

        fetchDoctors();
        if (user?.role === 'registrar') fetchSections();
    }, [user]);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/doctors', form);
            setDoctors([...doctors, response.data]);
            setForm({ full_name: '', category: '', birth_date: '', specialization: '', experience: '', section_id: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create doctor');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Doctors</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {user?.role === 'registrar' && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Create Doctor</h2>
                    <div className="grid grid-cols-1 gap-4">
                        <input
                            type="text"
                            name="full_name"
                            value={form.full_name}
                            onChange={handleInputChange}
                            placeholder="Full Name"
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleInputChange}
                            placeholder="Category"
                            className="p-2 border rounded"
                        />
                        <input
                            type="date"
                            name="birth_date"
                            value={form.birth_date}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="specialization"
                            value={form.specialization}
                            onChange={handleInputChange}
                            placeholder="Specialization"
                            className="p-2 border rounded"
                        />
                        <input
                            type="number"
                            name="experience"
                            value={form.experience}
                            onChange={handleInputChange}
                            placeholder="Experience (years)"
                            className="p-2 border rounded"
                        />
                        <select
                            name="section_id"
                            value={form.section_id}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                        >
                            <option value="">Select Section</option>
                            {sections.map((section) => (
                                <option key={section.ID} value={section.ID}>{section.Name}</option>
                            ))}
                        </select>
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                        >
                            Create Doctor
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {doctors.map((doctor) => (
                    <div key={doctor.ID} className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">{doctor.FullName}</h3>
                        <p>Category: {doctor.Category}</p>
                        <p>Birth Date: {doctor.BirthDate}</p>
                        <p>Specialization: {doctor.Specialization}</p>
                        <p>Experience: {doctor.Experience} years</p>
                        <p>Section: {doctor.Section?.Name || 'N/A'}</p>
                        <p>Created by: {doctor.User?.Username || 'Unknown'} ({doctor.User?.Role || 'Unknown'})</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Doctors;