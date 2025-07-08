import {useEffect, useState} from "react";
import axios from "axios";
import {Toaster, toast} from "react-hot-toast";
import {Eye, EyeOff} from "lucide-react";
import {BASE_URL} from "../api/BaseUrl.js";
import {APP_API} from "../api/AppAPI.js";
import {useNavigate} from "react-router-dom";

export const Profile = () => {
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();
    const [adminData, setAdminData] = useState({
        fullName: '',
        phone: '',
        password: ''
    });

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) navigate('/');
    }, []);
    const [originalData, setOriginalData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProfile = async () => {
            try {
                const res = await axios.get(`${BASE_URL}${APP_API.profile}`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                const data = {
                    fullName: res.data.fullName,
                    phone: res.data.phone,
                    password: ''
                };
                setAdminData(data);
                setOriginalData(data);
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
        if (name === "phone" && !/^\d{0,9}$/.test(value)) return;
        setAdminData(prev => ({...prev, [name]: value}));
    };

    const handleEdit = () => {
        setEditMode(true);
        setAdminData({
            fullName: '',
            phone: '',
            password: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            adminData.fullName === originalData.fullName &&
            adminData.phone === originalData.phone &&
            adminData.password === ''
        ) {
            toast.error("Hech qanday o‘zgarish kiritilmadi");
            return;
        }

        try {
            await axios.put(`${BASE_URL}${APP_API.update}`, adminData, {
                headers: {Authorization: `Bearer ${token}`}
            });
            toast.success("Ma'lumotlar yangilandi");

            // So‘rovdan keyin qayta yangilash
            const res = await axios.get(`${BASE_URL}${APP_API.profile}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            const updated = {
                fullName: res.data.fullName,
                phone: res.data.phone,
                password: ''
            };
            setAdminData(updated);
            setOriginalData(updated);
            setEditMode(false);
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
                        placeholder={editMode ? "Yangi ism kiriting" : ""}
                        className="w-full border border-gray-300 rounded p-2"
                        readOnly={!editMode}
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
                        placeholder={editMode ? "Yangi raqam kiriting" : ""}
                        className="w-full border border-gray-300 rounded p-2"
                        readOnly={!editMode}
                    />
                </div>

                {editMode && (
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
                )}

                {!editMode ? (
                    <>
                        <button
                            type="button"
                            onClick={handleEdit}
                            className="w-full bg-yellow-700 text-white py-2 px-4 rounded hover:bg-yellow-800"
                        >
                            Tahrirlash
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="w-full bg-red-700 text-white py-2 px-4 rounded hover:bg-red-800"
                        >
                            Chiqish
                        </button>
                    </>
                ) : (
                    <button
                        type="submit"
                        className="w-full bg-green-800 text-white py-2 px-4 rounded hover:bg-green-700"
                    >
                        O‘zgartirish
                    </button>
                )}
            </form>
            <Toaster position="top-center"/>
        </div>
    );
};
