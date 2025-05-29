import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-green-600 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <div className="space-x-4">
                    <Link to="/" className="hover:underline">Home</Link>
                    <Link to="/patients" className="hover:underline">Patients</Link>
                    <Link to="/doctors" className="hover:underline">Doctors</Link>
                    {user?.role === 'registrar' && (
                        <Link to="/sections" className="hover:underline">Sections</Link>
                    )}
                </div>
                <div>
                    {user ? (
                        <button onClick={handleLogout} className="hover:underline">
                            Logout ({user.role})
                        </button>
                    ) : (
                        <Link to="/login" className="hover:underline">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};
export default Navbar;