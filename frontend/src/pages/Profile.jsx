import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { ANALYTICS_BASE_URL } from "../config/env";

const Profile = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${ANALYTICS_BASE_URL}/user/${userId}`
        );
        const data = await res.json();
        console.log(data)
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchStats();
    else setLoading(false);
  }, [userId]);

  if (loading) return <Loader />;

  return (
  <>
    <Navbar />

    <div className="container mt-4">
      <h2 className="text-center mb-4">Profile</h2>

      <div className="row justify-content-center">
        <div className="col-xl-8 col-lg-9 col-md-11 col-sm-12">

          {/* USER INFO */}
          <div className="card mb-4 shadow-sm">
            <div className="card-body text-center">
              <div
                className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: "64px", height: "64px", fontSize: "1.5rem" }}
              >
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>

              <h5 className="mb-1">
                {user.username || "—"}
              </h5>

              <p className="text-muted mb-2">
                {user.email || "—"}
              </p>

              <p className="text-muted small">
                User ID: {userId}
              </p>
            </div>
          </div>

          {/* ACCOUNT STATS */}
          {stats && (
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="mb-3 text-center">
                  Account Summary
                </h5>

                <div className="row text-center">
                  <div className="col-md-4 col-sm-12 mb-3 mb-md-0">
                    <h6 className="text-muted">Total Tasks</h6>
                    <h4>{stats.totalTasks}</h4>
                  </div>

                  <div className="col-md-4 col-sm-12 mb-3 mb-md-0">
                    <h6 className="text-muted">Completed</h6>
                    <h4 className="text-success">
                      {stats.completedTasks}
                    </h4>
                  </div>

                  <div className="col-md-4 col-sm-12">
                    <h6 className="text-muted">Pending</h6>
                    <h4 className="text-warning">
                      {stats.pendingTasks}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT ACTIONS */}
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h5 className="mb-3">Account Actions</h5>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                <button
                  className="btn btn-outline-secondary"
                  disabled
                >
                  Change Password (Coming Soon)
                </button>

                <button
                  className="btn btn-outline-danger"
                  disabled
                >
                  Delete Account (Coming Soon)
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </>
);
};

export default Profile