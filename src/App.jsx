import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Home from './pages/Home';
import Patients from './pages/Patients';
import PatientDetails from './pages/PatientDetails';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import Sections from './pages/Sections';
import Schedules from './pages/Schedules';
import Visits from './pages/Visits';
import SectionDetails from "./pages/SectionDetails";
import SchedulesBySpecialization from "./pages/SchedulesBySpecialization";
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <div className="min-h-screen bg-green-50">
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
                <Route path="/patients/:id" element={<ProtectedRoute><PatientDetails /></ProtectedRoute>} />
                <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
                <Route path="/doctors/:id" element={<ProtectedRoute><DoctorDetails /></ProtectedRoute>} />
                <Route path="/sections" element={<ProtectedRoute><Sections /></ProtectedRoute>} />
                <Route path="/schedules" element={<ProtectedRoute><Schedules /></ProtectedRoute>} />
                <Route path="/visits" element={<ProtectedRoute><Visits /></ProtectedRoute>} />
                <Route path="/sections/:id" element={<ProtectedRoute><SectionDetails /></ProtectedRoute>} />
                <Route path="/schedules/specialization" element={<ProtectedRoute><SchedulesBySpecialization /></ProtectedRoute>} />
            </Routes>
        </div>
    );
}

export default App;