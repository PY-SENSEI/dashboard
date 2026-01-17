import { useEffect } from "react";
import { useNavigate } from "react-router";
import { isAuthenticated } from "~/data/auth";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
}
