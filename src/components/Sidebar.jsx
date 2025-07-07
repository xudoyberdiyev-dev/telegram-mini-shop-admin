import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Sidebar() {
    const [open, setOpen] = useState(false);

    const links = [
        { name: 'Category', path: 'category' },
        { name: 'Products', path: 'products' },
        { name: 'Orders', path: 'order' },
        { name: 'Profile', path: 'profile' },
    ];

    return (
        <>
            {/* Mobile toggle button */}
            <div className="md:hidden p-4 z-50 fixed top-0 left-0 bg-white shadow w-full">
                <button onClick={() => setOpen(!open)}>
                    {open ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`bg-white shadow-md h-screen w-64 fixed top-0 left-0 z-40 p-4 transition-transform transform md:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                } md:block`}
            >
                <h2 className="text-xl font-bold text-gray-800 mb-6">Admin Panel</h2>

                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.name}>
                            <NavLink
                                to={link.path}
                                onClick={() => setOpen(false)}
                                className={({ isActive }) =>
                                    `block px-4 py-2 rounded transition ${
                                        isActive
                                            ? 'bg-yellow-600 text-white'
                                            : 'text-gray-700 hover:bg-yellow-700 hover:text-white'
                                    }`
                                }
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </aside>
        </>
    );
}
