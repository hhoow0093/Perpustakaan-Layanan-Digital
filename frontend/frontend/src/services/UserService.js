export const getUsers = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/users");

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const result = await res.json();
    return result.data;
  } catch (err) {
    throw err; 
  }
};
