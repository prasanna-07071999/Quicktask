import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { API_BASE_URL } from "../config/env";

const FinishedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFinished = async () => {
      const res = await fetch(`${API_BASE_URL}/tasks?status=Completed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
      setLoading(false);
    };

    fetchFinished();
  }, []);

  return (
  <>
    <Navbar />

    <div className="container mt-4">
      <h2 className="text-center mb-4">Finished Tasks</h2>

      {loading && <Loader />}

      {!loading && tasks.length === 0 && (
        <p className="text-muted text-center">
          No finished tasks
        </p>
      )}

      {!loading && tasks.length > 0 && (
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10 col-sm-12">
            <ul className="list-group">
              {tasks.map((task) => (
                <li
                  key={task._id}
                  className="list-group-item d-flex gap-3 align-items-start"
                >
                  <span className="fs-5 text-success">✔</span>
                  
                  <div>
                    <div
                      className="fw-semibold"
                      style={{ textDecoration: "line-through" }}
                    >
                      {task.title}
                    </div>

                    {task.description && (
                      <div className="text-muted small">
                        {task.description}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  </>
);
};

export default FinishedTasks;
