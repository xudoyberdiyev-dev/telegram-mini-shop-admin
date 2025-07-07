import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    const token = sessionStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
}
