import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!token || !user) {
      alert("Silakan login terlebih dahulu!");
      navigate("/", { replace: true });
      return;
    }

    if (allowedRole && user.role !== allowedRole && !hasRedirected.current) {
      alert("Akses ditolak!");
        hasRedirected.current = true;
        console.log(user);

      if (user.role === "user") {
        navigate(`/dashboard/user/${user.UserID}`, { replace: true });
      } else {
        navigate(`/dashboard/admin/${user.UserID}`, { replace: true });
      }
    }
  }, [allowedRole, token, user, navigate]);

  // while redirecting, don’t render anything
  if (!token || !user) return null;
  if (allowedRole && user.role !== allowedRole) return null;

  return children;
}
