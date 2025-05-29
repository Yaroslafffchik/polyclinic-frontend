import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Patients = () => {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({
        full_name: '',
        address: '',
        gender: 'M',
        age: '',
        insurance_number: '',
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/patients');
                setPatients(response.data);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch patients');
            }
        };
        fetchPatients();
    }, []);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/patients', form);
            setPatients([...patients, response.data]);
            setForm({ full_name: '', address: '', gender: 'M', age: '', insurance_number: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create patient');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Patients</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {user?.role === 'registrar' && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Create Patient</h2>
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
                            name="address"
                            value={form.address}
                            onChange={handleInputChange}
                            placeholder="Address"
                            className="p-2 border rounded"
                        />
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleInputChange}
                            className="p-2 border rounded"
                        >
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        <input
                            type="number"
                            name="age"
                            value={form.age}
                            onChange={handleInputChange}
                            placeholder="Age"
                            className="p-2 border rounded"
                        />
                        <input
                            type="text"
                            name="insurance_number"
                            value={form.insurance_number}
                            onChange={handleInputChange}
                            placeholder="Insurance Number"
                            className="p-2 border rounded"
                        />
                        <button
                            onClick={handleSubmit}
                            className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                        >
                            Create Patient
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {patients.map((patient) => (
                    <div key={patient.ID} className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">{patient.FullName}</h3>
                        <p>Address: {patient.Address || 'N/A'}</p>
                        <p>Gender: {patient.Gender}</p>
                        <p>Age: {patient.Age}</p>
                        <p>Insurance: {patient.InsuranceNumber}</p>
                        <p>Created by: {patient.User?.Username || 'Unknown'} ({patient.User?.Role || 'Unknown'})</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Patients;