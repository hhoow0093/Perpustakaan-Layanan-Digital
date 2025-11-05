import { useState, useEffect } from "react";
import { getUsers } from "../services/UserService.js";

export function GetAllUsersHooks() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const users = await getUsers();
        if (mounted) setData(users);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, []);

  return { data, loading, error };
}
