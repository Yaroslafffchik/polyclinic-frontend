import React from 'react';
import { Link } from 'react-router-dom';
import patientPhoto from '../photos/patient.png';

const PatientCard = ({ patient, onEdit, role }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
                <img
                    src={patientPhoto}
                    alt={`Фото пациента ${patient.full_name}`}
                    className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                    <Link to={`/patients/${patient.ID}`} className="text-lg font-semibold hover:underline">
                        {patient.full_name}
                    </Link>
                    <p className="text-gray-600">{patient.age} лет</p>
                </div>
            </div>
            {role === 'registrar' && (
                <button
                    onClick={() => onEdit(patient)}
                    className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                >
                    Редактировать
                </button>
            )}
        </div>
    );
};

export default PatientCard;