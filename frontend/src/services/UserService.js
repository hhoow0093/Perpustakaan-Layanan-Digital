const API_URL = 'http://localhost:5000/api/users';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const getUsers = async () => {
  try {
    const res = await fetch(API_URL);

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (err) {
    throw err; 
  }
};

export const getBooksWithAvailability = async () => {
  try {
    const res = await fetch(`${API_URL}/books`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const result = await res.json();
    return result.data;
  } catch (err) {
    throw err;
  }
};

export const getRooms = async () => {
  try {
    const res = await fetch(`${API_URL}/rooms`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const result = await res.json();
    return result.data;
  } catch (err) {
    throw err;
  }
};

export const checkRoomAvailability = async (roomId, date, startTime, endTime) => {
  try {
    const params = new URLSearchParams({ roomId, date, startTime, endTime });
    const res = await fetch(`${API_URL}/room-availability?${params}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const result = await res.json();
    return result.data.available;
  } catch (err) {
    throw err;
  }
};

export const borrowBook = async (bookId) => {
  try {
    const res = await fetch(`${API_URL}/borrow-book`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ bookId })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to borrow book');
    }
    const result = await res.json();
    return result.data;
  } catch (err) {
    throw err;
  }
};

export const bookRoom = async (roomId, date, startTime, endTime) => {
  try {
    const res = await fetch(`${API_URL}/book-room`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ roomId, date, startTime, endTime })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to book room');
    }
    const result = await res.json();
    return result.data;
  } catch (err) {
    throw err;
  }
};

export const getBookHistory = async () => {
  try {
    const res = await fetch(`${API_URL}/book-history`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const result = await res.json();
    return result.data;
  } catch (err) {
    throw err;
  }
};

export const getRoomHistory = async () => {
  try {
    const res = await fetch(`${API_URL}/room-history`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const result = await res.json();
    return result.data;
  } catch (err) {
    throw err;
  }
};

export const getCurrentStats = async () => {
  try {
    const res = await fetch(`${API_URL}/current-stats`, {
      headers: getAuthHeader()
    });
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const result = await res.json();
    return result.data;
  } catch (err) {
    throw err;
  }
};
