import useUsers from "../hooks/useUsers";

export default function UsersPage() {
  const { data: users, loading, error } = useUsers();

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">User List</h1>
      <ul>
        {users.map(user => (
          <li key={user.UserID} className="p-2 border-b">
            {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
