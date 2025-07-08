import {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import {Eye, EyeOff} from 'lucide-react';
import {BASE_URL} from "../api/BaseUrl.js";
import {APP_API} from "../api/AppApi.js";

export default function Login() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        const data = {phone, password};
        try {
            const res = await axios.post(`${BASE_URL}${APP_API.login}`, data);

            sessionStorage.setItem('token', res.data.token);
            sessionStorage.setItem('admin', JSON.stringify(res.data.admin));
            navigate('/dashboard');
        } catch (err) {
            alert("login yoki parol xato");
        }
    };

    const handlePhoneInput = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // raqamdan boshqa harflarni olib tashlaydi
        if (value.length <= 9) setPhone(value);
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-purple-200">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-[350px]">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Admin Login</h2>

                <label className="block text-sm mb-1 text-gray-600">Telefon raqamingiz</label>
                <input
                    type="text"
                    inputMode="numeric"
                    value={phone}
                    onChange={handlePhoneInput}
                    placeholder="90xxxxxxx"
                    className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <label className="block text-sm mb-1 text-gray-600">Parol</label>
                <div className="relative mb-6">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="w-full p-2 pr-10 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                    </button>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded shadow font-semibold transition"
                >
                    Kirish
                </button>
            </div>
        </div>
    );
}
