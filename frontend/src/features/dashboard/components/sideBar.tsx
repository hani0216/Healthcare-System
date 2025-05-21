import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaSearch, FaMoneyCheckAlt, FaBookMedical, FaBars } from 'react-icons/fa';
import { useState } from 'react';

export default function SideBar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar backgroundColor="#fff" collapsed={collapsed}>
                <div style={{
                    padding: '20px',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    background: '#fff',
                    color: '#4CAF50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'space-between'
                }}>
                    {!collapsed && <span>Sidebar Menu</span>}
                    <button
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#4CAF50',
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
                        root: { color: '#4CAF50' },
                        button: {
                            padding: '12px 20px',
                            borderRadius: '8px',
                            margin: '8px 12px',
                            fontWeight: 500,
                            fontSize: '1rem',
                            background: '#fff',
                            color: '#4CAF50',
                            transition: 'background 0.2s',
                        },
                        icon: {
                            color: '#4CAF50',
                            fontSize: '1.2rem',
                            marginRight: '12px'
                        },
                        label: { marginLeft: '8px' }
                    }}
                >
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
            </Sidebar>
        </div>
    );
}