'use client';

import {useState, useEffect} from 'react';
import axios from 'axios';
import {BASE_URL} from "../api/BaseUrl.js";
import {APP_API} from "../api/AppApi.js";
import {Loading} from "../connection/Loading.jsx";

export const Category = () => {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const getCategory = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}${APP_API.category}`);
            setCategories(res.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    const saveCategory = async () => {
        if (!name || (!image && !editMode)) {
            alert("Barcha maydonlarni to‘ldiring!");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        if (image) formData.append("file", image);

        try {
            if (editMode && editId) {
                await axios.put(`${BASE_URL}${APP_API.category}/${editId}`, formData);
            } else {
                await axios.post(`${BASE_URL}${APP_API.category}`, formData);
            }

            // Tozalash
            setName('');
            setImage(null);
            setEditMode(false);
            setEditId(null);
            setPreviewImage(null);
            setShowForm(false);
            getCategory();
        } catch (err) {
            axios.isAxiosError(err) ? err.response?.data?.msg : 'Nomaʼlum xatolik yuz berdi';
            alert("Xatolik yuz berdi. Iltimos, barcha maydonlarni to‘ldiring va qaytadan urinib ko‘ring.");
        } finally {
            setIsLoading(false);
        }
    };


    const deleteCategory = async (id) => {
        const confirmDelete = window.confirm("Rostdan ham o‘chirmoqchimisiz?");
        if (!confirmDelete) return;
        try {
            await axios.delete(`${BASE_URL}${APP_API.category}/${id}`);
            getCategory();
        } catch (err) {
            const msg = axios.isAxiosError(err) ? err.response?.data?.msg : 'Xatolik yuz berdi';
            alert(msg);
        }
    };

    const editCategory = (cat) => {
        setEditMode(true);
        setEditId(cat._id);
        setName(cat.name);
        setPreviewImage(cat.image);
        setShowForm(true);
    };

    const handleAddCategory = () => {
        setEditMode(false);
        setEditId(null);
        setName('');
        setImage(null);
        setPreviewImage(null);
        setShowForm(true);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

            if (!allowedTypes.includes(file.type)) {
                alert("❌ Farmat to'g'ri kelmadi .jpg, .jpeg, .png va .webp formatdagi rasmlar yuklanadi.");
                e.target.value = null;
                setImage(null);
                setPreviewImage(null);
                return;
            }
            setImage(file);
            const url = URL.createObjectURL(file);
            setPreviewImage(url);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);
    if (loading) {
        return <Loading/>;
    }


    return (
        <div className="w-full p-4 ">
            <div
                className="flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl shadow">
                <h1 className="text-2xl font-bold text-yellow-600 mb-3 md:mb-0">Bo‘limlar</h1>
                <button onClick={handleAddCategory}
                        className="border border-yellow-800 text-yellow-700 px-4 py-2 rounded">
                    Qo‘shish
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
                        <h2 className="text-lg font-semibold text-yellow-700 mb-4 text-center">
                            {editMode ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya qo‘shish'}
                        </h2>

                        {previewImage && (
                            <div className="mb-3">
                                <p className="text-sm text-gray-600 mb-1">Tanlangan rasm:</p>
                                <img src={previewImage} alt="Preview"
                                     className="w-full h-32 object-cover rounded border"/>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
                                Rasm (faqat .jpg, .jpeg, .png, .webp formatlar qabul qilinadi)
                            </label>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={handleFileChange}
                                className="w-full border border-gray-300 p-2 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1 text-sm font-medium text-gray-700">Kategoriya nomi</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 p-2 rounded"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditMode(false);
                                    setEditId(null);
                                    setName('');
                                    setImage(null);
                                    setPreviewImage(null);
                                }}
                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Bekor qilish
                            </button>
                            <button
                                onClick={saveCategory}
                                className="w-700 text-white bg-yellow-600 px-4 py-2 rounded  hover:bg-yellow-700 disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading
                                    ? (editMode ? "Tahrirlanmoqda..." : "Saqlanmoqda...")
                                    : (editMode ? "Tahrirlash" : "Saqlash")}
                            </button>

                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6 overflow-auto">
                <table className="w-full bg-white border rounded-lg text-sm">
                    <thead className="bg-yellow-100 text-gray-700">
                    <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Rasm</th>
                        <th className="p-3 text-left">Kategoriya nomi</th>
                        <th className="p-3 text-center">Amallar</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.map((cat, idx) => (
                        <tr key={cat._id} className="border-t hover:bg-yellow-50">
                            <td className="p-3">{idx + 1}</td>
                            <td className="p-3">
                                <div className="w-16 h-12 overflow-hidden border rounded">
                                    <img src={cat.image} alt="img" className="w-full h-full object-cover"/>
                                </div>
                            </td>
                            <td className="p-3">{cat.name}</td>
                            <td className="p-3 text-center">
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => editCategory(cat)}
                                        className="bg-yellow-600 text-white px-3 py-2  rounded text-xs hover:bg-yellow-700"
                                    >
                                        <p className={'text-sm'}>Tahrirlash</p>
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(cat._id)}
                                        className="bg-red-600 text-white px-3 py-2 rounded text-xs hover:bg-red-700"
                                    >
                                        <p className={'text-sm'}>O‘chirish</p>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
