import {useEffect, useState} from "react";
import axios from "axios";
import {Toaster, toast} from "react-hot-toast";
import {Eye, EyeOff} from "lucide-react";
import {BASE_URL} from "../api/BaseUrl.js";
import {APP_API} from "../api/AppAPI.js";

export const Profile = () => {
    const token = sessionStorage.getItem("token");
    const [adminData, setAdminData] = useState({
        fullName: '',
        phone: '',
        password: ''
    });
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await axios.get(`${BASE_URL}${APP_API.profile}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAdminData({
                    fullName: res.data.fullName,
                    phone: res.data.phone,
                    password: ''
                });
                setLoading(false);
            } catch (err) {
                console.error("Profilni olishda xatolik:", err);
                setLoading(false);
            }
        };

        if (token) getProfile();
    }, [token]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "phone") {
            if (/^\d{0,9}$/.test(value)) {
                setAdminData({...adminData, [name]: value});
            }
        } else {
            setAdminData({...adminData, [name]: value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}${APP_API.update}`, adminData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Ma'lumotlar yangilandi");
        } catch (err) {
            console.error("Yangilashda xatolik:", err);
            toast.error("Xatolik yuz berdi");
        }
    };
    if (loading) return <p>Yuklanmoqda...</p>;

    return (
        <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold text-yellow-700 mb-4 text-center">Admin Profil</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">To‘liq ism</label>
                    <input
                        type="text"
                        name="fullName"
                        value={adminData.fullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Telefon raqam</label>
                    <input
                        type="text"
                        name="phone"
                        value={adminData.phone}
                        onChange={handleChange}
                        inputMode="numeric"
                        className="w-full border border-gray-300 rounded p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Yangi parol (ixtiyoriy)</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={adminData.password}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded p-2 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                        >
                            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-700 text-white rounded hover:bg-yellow-800 w-full"
                >
                    Yangilash
                </button>
            </form>
            <Toaster position="top-center"/>
        </div>
    );
};
