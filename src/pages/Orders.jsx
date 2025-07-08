import {useEffect, useState} from 'react';
import axios from 'axios';
import {BASE_URL} from '../api/BaseUrl';
import {APP_API} from '../api/AppApi';
import {Loading} from "../connection/Loading.jsx";
import toast from 'react-hot-toast';

export const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const getOrders = async (page) => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}${APP_API.order}/getAllOrders?page=${page}&limit=10`);
            setOrders(res.data.orders);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.currentPage);
        } catch (err) {
            toast.error("Buyurtmalarni olishda xatolik");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    useEffect(() => {
        getOrders(currentPage);
    }, [currentPage]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const body = {status: newStatus};
            await axios.put(`${BASE_URL}${APP_API.order}/updateStatus/${orderId}`, body);
            toast.success("Holat yangilandi");
            getOrders(currentPage); // listni yangilash
        } catch (err) {
            toast.error("Holatni yangilashda xatolik");
        }
    };

    return (
        <div className="w-full p-4">
            <div
                className="flex mb-5 flex-col md:flex-row md:items-center md:justify-between bg-white p-4 rounded-xl shadow">
                <h1 className={'text-yellow-600 text-3xl font-semibold'}>Buyurtmalar</h1>
            </div>

            {loading ? (
                <Loading/>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-md">
                        <thead>
                        <tr className="bg-yellow-100 text-sm text-gray-700">
                            <th className="p-2 border-b">#</th>
                            <th className="p-2 border-b">Foydalanuvchi</th>
                            <th className="p-2 border-b">Telefon</th>
                            <th className="p-2 border-b">Mahsulotlar</th>
                            <th className="p-2 border-b">Umumiy narx</th>
                            <th className="p-2 border-b">Holat</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.map((order, index) => (
                            <tr key={order._id} className="text-sm hover:bg-yellow-50">
                                <td className="p-2 border-b">{(currentPage - 1) * 10 + index + 1}</td>
                                <td className="p-2 border-b">{order.user_id?.name}</td>
                                <td className="p-2 border-b">{order.phone}</td>
                                <td className="p-2 border-b">
                                    {order.products.map((p, i) => (
                                        <div key={i}>{p.product_id?.name} × {p.count}</div>
                                    ))}
                                </td>
                                <td className="p-2 border-b">{order.total_price} so'm</td>
                                <td className="p-2 border-b">
                                    <select
                                        className="border rounded px-2 py-1 text-xs bg-white"
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <option value="BUYURTMA">BUYURTMA</option>
                                        <option value="QABUL QILINDI">QABUL QILINDI</option>
                                        <option value="QADOQLANMOQDA">QADOQLANMOQDA</option>
                                        <option value="YETKAZILMOQDA">YETKAZILMOQDA</option>
                                        <option value="YETIB KELDI">YETIB KELDI</option>
                                        <option value="HARIDOR QABUL QILDI">HARIDOR QABUL QILDI</option>
                                        <option value="BEKOR QILINDI">BEKOR QILINDI</option>
                                    </select>

                                    {order.status === "BEKOR QILINDI" && (
                                        <div className="text-red-600 text-xs mt-1">
                                            {order.cancel_reason}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <div className="flex justify-center mt-4 gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded"
                        >
                            Oldingi
                        </button>
                        <span className="px-4 py-1">{currentPage} / {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded"
                        >
                            Keyingi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
