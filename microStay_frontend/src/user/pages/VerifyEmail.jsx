import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../utils/api";
import { Loader2 } from "lucide-react";
import { useRef } from "react";

export default function VerifyEmail() {

  const [search] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");



  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const token = search.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get("/auth/verify-email", {
          params: { token }
        });

        if (res.data.status === "VERIFIED") {
          setStatus("success");

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, []);
  
  // ---------- UI ----------

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">

      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl text-center">

        {status === "loading" && (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600 mb-4" />
            <h2 className="text-xl font-bold">Verifying Email...</h2>
            <p className="text-slate-600 mt-2">
              Please wait a moment
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-600">
              Email Verified ✅
            </h2>
            <p className="text-slate-600 mt-3">
              Redirecting to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-600">
              Verification Failed
            </h2>
            <p className="text-slate-600 mt-3">
              Link expired or invalid
            </p>
          </>
        )}

      </div>
    </div>
  );
}
