import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    const res = await fetch("http://localhost:5000/api/users");
    const data = await res.json();   
    console.log(data);
    setUsers(data.data);
  };

  useEffect(() => { getUsers(); }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">User CRUD</h1>

      <ul className="mt-6">
        {users.map((u) => (
          <li key={u.id} className="border p-2 my-2">
            {u.UserID} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
