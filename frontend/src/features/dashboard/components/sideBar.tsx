import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaSearch, FaMoneyCheckAlt, FaBookMedical, FaBars, FaSignOutAlt, FaTachometerAlt, FaHistory } from 'react-icons/fa';
import { useState } from 'react';
import '../../../index.css';

export default function SideBar() {
    const [collapsed, setCollapsed] = useState(true);
    const navigate = useNavigate();

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
                    color: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between'
                }}>
                    {!collapsed && <span>
                        Welcome {localStorage.getItem('userName')?.split(' ')[0] || ''} !
                    </span>}
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--primary-color)',
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
                        root: { color: 'var(--primary-color)' },
                        button: {
                            padding: '12px 20px',
                            borderRadius: '8px',
                            margin: '8px 12px',
                            fontWeight: 500,
                            fontSize: '1rem',
                            background: '#fff',
                            color: 'var(--primary-color)',
                            transition: 'background 0.2s',
                        },
                        icon: {
                            color: 'var(--primary-color)', // <-- icons now use primary color
                            fontSize: '1.2rem',
                            marginRight: '12px'
                        },
                        label: { marginLeft: '8px' }
                    }}
                >
                    <MenuItem icon={<FaTachometerAlt />} component={<Link to="/dashboard" />}>
                        Dashboard
                    </MenuItem>
                    <MenuItem icon={<FaHistory />} component={<Link to="/history" />}>
                        History
                    </MenuItem>
                    <MenuItem icon={<FaUser />} component={<Link to="/profile" />}>
                        Profile
                    </MenuItem>
                    <MenuItem icon={<FaCalendarAlt />} component={<Link to="/calendar" />}>
                        Calendar
                    </MenuItem>
                    <MenuItem icon={<FaSearch />} component={<Link to="/search" />}>
                        Search
                    </MenuItem>
                    <MenuItem icon={<FaMoneyCheckAlt />} component={<Link to="/reimbursement" />}>
                        Reimbursement
                    </MenuItem>
                    <MenuItem icon={<FaBookMedical />} component={<Link to="/medical-record" />}>
                        Medical Record
                    </MenuItem>
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
                        <FaSignOutAlt style={{ color: '#ff374b' , fontSize: '1.5rem', marginRight: collapsed ? 0 : 8 }} />
                        {!collapsed && "Logout"}
                    </button>
                </div>
            </Sidebar>
        </div>
    );
}