import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminService } from '../services/AdminService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faDoorOpen, faSignOutAlt, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../styles/shared-dashboard.css';
import './AdminDashBoard.css';

export default function AdminDashBoard() { 
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalBookLoans: 0,
        totalRoomBookings: 0
    });
    
    const [recentLoans, setRecentLoans] = useState([]);
    const [recentBookings, setRecentBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('books'); // 'books', 'rooms', or 'users'
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Get current logged in user
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(user);
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [statsData, loansData, bookingsData, usersData] = await Promise.all([
                AdminService.getDashboardStats(),
                AdminService.getRecentBookLoans(100),
                AdminService.getRecentRoomBookings(100),
                fetch('http://localhost:5000/api/users', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(res => res.json())
            ]);

            console.log('Users data:', usersData);
            
            setStats(statsData.data);
            setRecentLoans(loansData.data);
            setRecentBookings(bookingsData.data);
            setUsers(usersData.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message || 'Gagal memuat data dashboard');
            setLoading(false);
            
            if (error.message?.includes('Token') || error.message?.includes('401')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-text">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-content">
                    <p className="error-text">Error: {error}</p>
                    <button 
                        onClick={fetchDashboardData}
                        className="retry-button"
                    >
                        Coba Lagi
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-content">
                        <div className="navbar-brand">
                            <FontAwesomeIcon icon={faBook} className="navbar-icon" />
                            <h1 className="navbar-title">Perpustakaan Digital</h1>
                        </div>
                        <div className="navbar-actions">
                            <span className="navbar-label">Admin Dashboard</span>
                            <button 
                                onClick={handleLogout}
                                className="logout-button"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="main-content">
                {/* User Info Section */}
                <div className="profile-card">
                    <div className="profile-content">
                        <div className="profile-icon-wrapper">
                            <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
                        </div>
                        <div className="profile-info">
                            <h2>👋 Selamat Datang, Admin!</h2>
                            <p>Email: {currentUser?.email || 'Loading...'}</p>
                            <p>User ID: {currentUser?.UserID || 'Loading...'}</p>
                            <p>Role: {currentUser?.role?.toUpperCase() || 'ADMIN'}</p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="stats-grid">
                    {/* Total Book Loans */}
                    <div className="stat-card">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Total Peminjaman Buku</p>
                                <p className="stat-value">{stats.totalBookLoans}</p>
                            </div>
                            <div className="stat-icon-wrapper">
                                <FontAwesomeIcon icon={faBook} className="stat-icon" />
                            </div>
                        </div>
                    </div>

                    {/* Total Room Bookings */}
                    <div className="stat-card">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">Total Booking Ruangan</p>
                                <p className="stat-value">{stats.totalRoomBookings}</p>
                            </div>
                            <div className="stat-icon-wrapper">
                                <FontAwesomeIcon icon={faDoorOpen} className="stat-icon" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="tabs-container">
                    <div className="tabs-header">
                        <nav className="tabs-nav">
                            <button
                                onClick={() => setActiveTab('books')}
                                className={`tab-button ${activeTab === 'books' ? 'active' : 'inactive'}`}
                            >
                                <FontAwesomeIcon icon={faBook} className="mr-2" />
                                Log Peminjaman Buku ({recentLoans.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('rooms')}
                                className={`tab-button ${activeTab === 'rooms' ? 'active' : 'inactive'}`}
                            >
                                <FontAwesomeIcon icon={faDoorOpen} className="mr-2" />
                                Log Booking Ruangan ({recentBookings.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`tab-button ${activeTab === 'users' ? 'active' : 'inactive'}`}
                            >
                                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                                List Akun User ({users.length})
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="mt-6">
                    {activeTab === 'books' && (
                        <div className="table-wrapper">
                            <div className="table-header">
                                <h3 className="table-title">Log Peminjaman Buku</h3>
                                <p className="table-subtitle">Menampilkan {recentLoans.length} peminjaman terbaru</p>
                            </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead className="table-head">
                                    <tr>
                                        <th>User ID</th>
                                        <th>Nama Lengkap</th>
                                        <th>Email</th>
                                        <th>Nomor Induk</th>
                                        <th>Judul Buku</th>
                                        <th>Genre</th>
                                        <th>Tgl Pinjam</th>
                                        <th>Deadline</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {recentLoans.length > 0 ? recentLoans.map((loan, index) => (
                                        <tr key={index} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                            <td className="table-cell id">{loan.user_id}</td>
                                            <td className="table-cell name">
                                                {loan.nama_depan} {loan.nama_belakang}
                                            </td>
                                            <td className="table-cell text">{loan.user_email}</td>
                                            <td className="table-cell name">{loan.nomor_induk}</td>
                                            <td className="table-cell name">{loan.book_title}</td>
                                            <td className="table-cell text">{loan.book_genre}</td>
                                            <td className="table-cell text">
                                                {new Date(loan.tanggal_peminjaman).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="table-cell text">
                                                {loan.tanggal_deadline_checkout ? new Date(loan.tanggal_deadline_checkout).toLocaleDateString('id-ID') : '-'}
                                            </td>
                                            <td className="table-cell">
                                                <span className={`status-badge ${loan.status === 'Dikembalikan' ? 'returned' : 'borrowed'}`}>
                                                    {loan.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="9" className="empty-state">
                                                Tidak ada data peminjaman buku
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    )}

                    {activeTab === 'rooms' && (
                        <div className="table-wrapper">
                            <div className="table-header">
                                <h3 className="table-title">Log Booking Ruangan</h3>
                                <p className="table-subtitle">Menampilkan {recentBookings.length} booking terbaru</p>
                            </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead className="table-head">
                                    <tr>
                                        <th>User ID</th>
                                        <th>Nama Lengkap</th>
                                        <th>Email</th>
                                        <th>Nomor Induk</th>
                                        <th>Nama Ruangan</th>
                                        <th>Kapasitas</th>
                                        <th>Tanggal</th>
                                        <th>Waktu Masuk</th>
                                        <th>Waktu Keluar</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {recentBookings.length > 0 ? recentBookings.map((booking, index) => (
                                        <tr key={index} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                            <td className="table-cell id">{booking.user_id}</td>
                                            <td className="table-cell name">
                                                {booking.nama_depan} {booking.nama_belakang}
                                            </td>
                                            <td className="table-cell text">{booking.user_email}</td>
                                            <td className="table-cell name">{booking.nomor_induk}</td>
                                            <td className="table-cell name">{booking.room_name}</td>
                                            <td className="table-cell text">{booking.room_capacity} orang</td>
                                            <td className="table-cell text">
                                                {new Date(booking.tanggal_peminjaman).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="table-cell text">
                                                {new Date(booking.jam_masuk).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}
                                            </td>
                                            <td className="table-cell text">
                                                {new Date(booking.jam_keluar).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="9" className="empty-state">
                                                Tidak ada data booking ruangan
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="table-wrapper">
                            <div className="table-header">
                                <h3 className="table-title">List Akun User</h3>
                                <p className="table-subtitle">Menampilkan {users.length} akun user terdaftar</p>
                            </div>
                        <div className="table-container">
                            <table className="data-table">
                                <thead className="table-head">
                                    <tr>
                                        <th>User ID</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody className="table-body">
                                    {users.length > 0 ? users.map((user, index) => (
                                        <tr key={index} className={`table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
                                            <td className="table-cell id">{user.UserID}</td>
                                            <td className="table-cell text">{user.email}</td>
                                            <td className="table-cell">
                                                <span className={`status-badge ${user.role === 'admin' ? 'admin' : 'user'}`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="empty-state">
                                                Tidak ada data user
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}