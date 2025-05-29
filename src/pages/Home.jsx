import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome to Polyclinic</h1>
            <p className="text-lg">You are logged in as <span className="font-semibold">{user?.role}</span>.</p>
            {user?.role === 'registrar' ? (
                <p>Use the navigation to manage patients, doctors, and sections.</p>
            ) : (
                <p>Use the navigation to view patients and doctors.</p>
            )}
        </div>
    );
};

export default Home;