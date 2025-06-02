import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaSearch, FaMoneyCheckAlt, FaBookMedical, FaBars, FaSignOutAlt, FaTachometerAlt, FaHistory, FaBell } from 'react-icons/fa';
import { useState } from 'react';
import '../../../index.css';

export default function SideBar() {
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar backgroundColor="#fff" collapsed={collapsed} width="270px">
                <div style={{
                    padding: '20px',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    background: '#fff',
                    color: '#222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between'
                }}>
                    {!collapsed && <span>
                        Welcome Insurance !
                    </span>}
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#28A6A7',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            marginLeft: collapsed ? 0 : '10px'
                        }}
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label="Toggle sidebar"
                    >
                        <FaBars />
                    </button>
                </div>
                <Menu
                    menuItemStyles={{
                        root: { color: '#222' },
                        button: {
                            padding: '12px 20px',
                            borderRadius: '8px',
                            margin: '8px 12px',
                            fontWeight: 500,
                            fontSize: '1rem',
                            background: '#fff',
                            color: '#222',
                            transition: 'background 0.2s',
                        },
                        icon: {
                            color: '#28A6A7',
                            fontSize: '1.2rem',
                            marginRight: '12px'
                        },
                        label: { marginLeft: '8px' }
                    }}
                >
                    <MenuItem
                        icon={<FaTachometerAlt />}
                        component={<Link to="/insuranceHome" />}
                        active={location.pathname === "/insuranceHome"}
                    >
                        Dashboard
                    </MenuItem>
                    <MenuItem
                        icon={<FaBell />}
                        component={<Link to="/insuranceNotification" />}
                        active={location.pathname === "/insuranceNotification"}
                    >
                        Notifications
                    </MenuItem>
                    <MenuItem
                        icon={<FaHistory />}
                        component={<Link to="/insuranceHistory" />}
                        active={location.pathname === "/insuranceHistory"}
                    >
                        History
                    </MenuItem>
                    <MenuItem
                        icon={<FaUser />}
                        component={<Link to="/insuranceProfile" />}
                        active={location.pathname === "/insuranceProfile"}
                    >
                        Profile
                    </MenuItem>
                    <MenuItem
                        icon={<FaCalendarAlt />}
                        component={<Link to="/insuranceCalendar" />}
                        active={location.pathname === "/insuranceCalendar"}
                    >
                        Calendar
                    </MenuItem>
                    <MenuItem
                        icon={<FaSearch />}
                        component={<Link to="/insuranceSearch" />}
                        active={location.pathname === "/insuranceSearch"}
                    >
                        Search
                    </MenuItem>
                    {/* Ajoute ici d'autres liens spécifiques à l'assurance si besoin */}
                </Menu>
                {/* Footer logout button */}
                <div
                    style={{
                        marginTop: 'auto',
                        padding: '20px',
                        borderTop: '1px solid #eee',
                        background: '#fff',
                        textAlign: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '70px'
                    }}
                >
                    <button
                        onClick={handleLogout}
                        style={{
                            background: collapsed ? 'none' : '#ff374b',
                            color: collapsed ? 'transparent' : '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: collapsed ? '0' : '10px 24px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: collapsed ? 'auto' : '100%'
                        }}
                        title="Logout"
                    >
                        <FaSignOutAlt style={{ color: '#ff374b', fontSize: '1.5rem', marginRight: collapsed ? 0 : 8 }} />
                        {!collapsed && "Logout"}
                    </button>
                </div>
            </Sidebar>
        </div>
    );
}