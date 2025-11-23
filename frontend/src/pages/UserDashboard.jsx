import './UserDashboard.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faDoorOpen, faHistory, faSignOutAlt, faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import * as UserService from '../services/UserService';

export default function UserDashboard() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [activePage, setActivePage] = useState('borrow-book');
    const [stats, setStats] = useState({ booksCount: 0, roomsCount: 0 });

    // Borrow Book State
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [bookSearch, setBookSearch] = useState('');
    const [genreFilter, setGenreFilter] = useState('');

    // Borrow Room State
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [roomSearch, setRoomSearch] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // History State
    const [bookHistory, setBookHistory] = useState([]);
    const [roomHistory, setRoomHistory] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(user);
        fetchStats();
    }, []);

    useEffect(() => {
        if (activePage === 'borrow-book') {
            fetchBooks();
        } else if (activePage === 'borrow-room') {
            fetchRooms();
        } else if (activePage === 'book-history') {
            fetchBookHistory();
        } else if (activePage === 'room-history') {
            fetchRoomHistory();
        }
    }, [activePage]);

    useEffect(() => {
        filterBooks();
    }, [bookSearch, genreFilter, books]);

    useEffect(() => {
        filterRooms();
    }, [roomSearch, rooms]);

    const fetchStats = async () => {
        try {
            const data = await UserService.getCurrentStats();
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const data = await UserService.getBooksWithAvailability();
            setBooks(data);
            setFilteredBooks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const data = await UserService.getRooms();
            setRooms(data);
            setFilteredRooms(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookHistory = async () => {
        try {
            setLoading(true);
            const data = await UserService.getBookHistory();
            setBookHistory(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoomHistory = async () => {
        try {
            setLoading(true);
            const data = await UserService.getRoomHistory();
            setRoomHistory(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const filterBooks = () => {
        let filtered = books;
        
        if (bookSearch) {
            filtered = filtered.filter(book =>
                book.Judul.toLowerCase().includes(bookSearch.toLowerCase())
            );
        }
        
        if (genreFilter) {
            filtered = filtered.filter(book => book.Genre === genreFilter);
        }
        
        setFilteredBooks(filtered);
    };

    const filterRooms = () => {
        let filtered = rooms;
        
        if (roomSearch) {
            filtered = filtered.filter(room =>
                room.Nama_ruangan.toLowerCase().includes(roomSearch.toLowerCase())
            );
        }
        
        setFilteredRooms(filtered);
    };

    const handleBorrowBook = async (bookId) => {
        try {
            await UserService.borrowBook(bookId);
            alert('Berhasil meminjam buku!');
            fetchBooks();
            fetchStats();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleBookRoom = async (e) => {
        e.preventDefault();
        
        if (!selectedRoom || !selectedDate || !startTime || !endTime) {
            alert('Mohon lengkapi semua field');
            return;
        }

        const startDateTime = `${selectedDate} ${startTime}:00`;
        const endDateTime = `${selectedDate} ${endTime}:00`;

        try {
            await UserService.bookRoom(selectedRoom, selectedDate, startDateTime, endDateTime);
            alert('Berhasil memesan ruangan!');
            setSelectedRoom('');
            setSelectedDate('');
            setStartTime('');
            setEndTime('');
            fetchStats();
        } catch (err) {
            alert(err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const renderBorrowBookPage = () => (
        <div className="page-content">
            <div className="banner">
                <h2>Selamat Datang, {currentUser?.email}!</h2>
                <p className="stat-text">Anda sedang meminjam <strong>{stats.booksCount}</strong> buku</p>
            </div>

            <div className="search-filter-container">
                <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Cari buku..."
                        value={bookSearch}
                        onChange={(e) => setBookSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="filter-box">
                    <FontAwesomeIcon icon={faFilter} className="filter-icon" />
                    <select
                        value={genreFilter}
                        onChange={(e) => setGenreFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Semua Genre</option>
                        <option value="Novel">Novel</option>
                        <option value="Komik">Komik</option>
                        <option value="Jurnal">Jurnal</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
            </div>

            <div className="books-grid">
                {loading ? (
                    <p>Loading...</p>
                ) : filteredBooks.length === 0 ? (
                    <p>Tidak ada buku ditemukan</p>
                ) : (
                    filteredBooks.map((book) => (
                        <div key={book.NIB} className="book-card">
                            <h3>{book.Judul}</h3>
                            <p className="book-genre">{book.Genre}</p>
                            <p className="book-id">ID: {book.NIB}</p>
                            <div className={`status-badge ${book.status.toLowerCase()}`}>
                                {book.status === 'Available' ? 'Tersedia' : 'Tidak Tersedia'}
                            </div>
                            {book.status === 'Available' && (
                                <button
                                    onClick={() => handleBorrowBook(book.NIB)}
                                    className="btn-borrow"
                                >
                                    Pinjam Buku
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );

    const renderBorrowRoomPage = () => (
        <div className="page-content">
            <div className="banner">
                <h2>Selamat Datang, {currentUser?.email}!</h2>
                <p className="stat-text">Anda memiliki <strong>{stats.roomsCount}</strong> booking ruangan aktif</p>
            </div>

            <div className="search-filter-container">
                <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Cari ruangan..."
                        value={roomSearch}
                        onChange={(e) => setRoomSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            <form onSubmit={handleBookRoom} className="room-booking-form">
                <div className="form-group">
                    <label>Pilih Ruangan:</label>
                    <select
                        value={selectedRoom}
                        onChange={(e) => setSelectedRoom(e.target.value)}
                        className="form-select"
                        required
                    >
                        <option value="">-- Pilih Ruangan --</option>
                        {filteredRooms.map((room) => (
                            <option key={room.NIR} value={room.NIR}>
                                {room.Nama_ruangan} (Kapasitas: {room.Batas_Jumlah})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Tanggal:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="form-input"
                        min={new Date().toISOString().split('T')[0]}
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Jam Mulai:</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Jam Selesai:</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="form-input"
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="btn-submit">
                    Pesan Ruangan
                </button>
            </form>

            <div className="rooms-list">
                <h3>Daftar Ruangan Tersedia</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : filteredRooms.length === 0 ? (
                    <p>Tidak ada ruangan ditemukan</p>
                ) : (
                    <div className="rooms-grid">
                        {filteredRooms.map((room) => (
                            <div key={room.NIR} className="room-card">
                                <h4>{room.Nama_ruangan}</h4>
                                <p>Kapasitas: {room.Batas_Jumlah} orang</p>
                                <p className="room-id">ID: {room.NIR}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    const renderBookHistoryPage = () => (
        <div className="page-content">
            <h2>Riwayat Peminjaman Buku</h2>
            {loading ? (
                <p>Loading...</p>
            ) : bookHistory.length === 0 ? (
                <p>Belum ada riwayat peminjaman buku</p>
            ) : (
                <div className="history-table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>ID Peminjaman</th>
                                <th>Judul Buku</th>
                                <th>Genre</th>
                                <th>Tgl Pinjam</th>
                                <th>Tgl Kembali</th>
                                <th>Deadline</th>
                                <th>Denda</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookHistory.map((record) => (
                                <tr key={record.pinjam_BUKU_ID}>
                                    <td>{record.pinjam_BUKU_ID}</td>
                                    <td>{record.Judul}</td>
                                    <td>{record.Genre}</td>
                                    <td>{new Date(record.tanggal_peminjaman).toLocaleDateString('id-ID')}</td>
                                    <td>{record.tanggal_checkout ? new Date(record.tanggal_checkout).toLocaleDateString('id-ID') : '-'}</td>
                                    <td>{new Date(record.tanggal_deadline_checkout).toLocaleDateString('id-ID')}</td>
                                    <td>Rp {record.DENDA.toLocaleString('id-ID')}</td>
                                    <td>
                                        <span className={`status-badge-small ${record.status.toLowerCase()}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    const renderRoomHistoryPage = () => (
        <div className="page-content">
            <h2>Riwayat Peminjaman Ruangan</h2>
            {loading ? (
                <p>Loading...</p>
            ) : roomHistory.length === 0 ? (
                <p>Belum ada riwayat peminjaman ruangan</p>
            ) : (
                <div className="history-table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>ID Booking</th>
                                <th>Nama Ruangan</th>
                                <th>Kapasitas</th>
                                <th>Tanggal</th>
                                <th>Jam Masuk</th>
                                <th>Jam Keluar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roomHistory.map((record) => (
                                <tr key={record.pinjam_ruangan_ID}>
                                    <td>{record.pinjam_ruangan_ID}</td>
                                    <td>{record.Nama_ruangan}</td>
                                    <td>{record.Batas_Jumlah} orang</td>
                                    <td>{new Date(record.tanggal_peminjaman).toLocaleDateString('id-ID')}</td>
                                    <td>{new Date(record.jam_masuk).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{new Date(record.jam_keluar).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );

    return (
        <div className="main-content flex min-w-[100vw] min-h-[100vh] p-0 m-0">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h2>User Dashboard</h2>
                    <p className="user-email">{currentUser?.email}</p>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activePage === 'borrow-book' ? 'active' : ''}`}
                        onClick={() => setActivePage('borrow-book')}
                    >
                        <FontAwesomeIcon icon={faBook} className="nav-icon" />
                        <span>Pinjam Buku</span>
                    </button>

                    <button
                        className={`nav-item ${activePage === 'borrow-room' ? 'active' : ''}`}
                        onClick={() => setActivePage('borrow-room')}
                    >
                        <FontAwesomeIcon icon={faDoorOpen} className="nav-icon" />
                        <span>Pinjam Ruangan</span>
                    </button>

                    <button
                        className={`nav-item ${activePage === 'book-history' ? 'active' : ''}`}
                        onClick={() => setActivePage('book-history')}
                    >
                        <FontAwesomeIcon icon={faHistory} className="nav-icon" />
                        <span>Riwayat Buku</span>
                    </button>

                    <button
                        className={`nav-item ${activePage === 'room-history' ? 'active' : ''}`}
                        onClick={() => setActivePage('room-history')}
                    >
                        <FontAwesomeIcon icon={faHistory} className="nav-icon" />
                        <span>Riwayat Ruangan</span>
                    </button>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                    <span>Logout</span>
                </button>
            </div>

            <div className="dashboard-main">
                {activePage === 'borrow-book' && renderBorrowBookPage()}
                {activePage === 'borrow-room' && renderBorrowRoomPage()}
                {activePage === 'book-history' && renderBookHistoryPage()}
                {activePage === 'room-history' && renderRoomHistoryPage()}
            </div>
        </div>
    );
}