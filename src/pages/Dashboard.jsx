import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from "../components/Sidebar.jsx";

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) navigate('/');
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl mb-4">🎉 Admin Panel</h1>
            <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleLogout}
            >
                Chiqish
            </button>
            <Sidebar/>
        </div>
    );
}
