import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { API_BASE_URL } from "../config/env";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);

  // Create task fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Todo");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");


  // Edit task
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  /* ---------------- FETCH TASKS ---------------- */
  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
        if (filterStatus) params.append("status", filterStatus);
        if (filterPriority) params.append("priority", filterPriority);
        if (search) params.append("search", search);
        if (sortBy) params.append("sortBy", sortBy);

       const response = await fetch(
        `${API_BASE_URL}/tasks?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      // Show only non-completed tasks
      const activeTasks = Array.isArray(data)
        ? data.filter((task) => task.status !== "Completed")
        : [];

      setTasks(activeTasks);
    } catch (err) {
      console.error(err);
      setError("Unable to load tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterPriority, search, sortBy]);

  /* ---------------- CREATE TASK ---------------- */
  const createTask = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate) return;

    await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        status,
        priority,
        dueDate,
      }),
    });

    // Reset form
    setTitle("");
    setDescription("");
    setStatus("Todo");
    setPriority("Medium");
    setDueDate("");

    fetchTasks();
  };

  const startEdit = (task) => {
      setEditId(task._id);
      setEditTitle(task.title);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  }

  /* ---------------- UPDATE TASK ---------------- */
  const updateTask = async () => {
    if (!editTitle.trim()) return;

    await fetch(`${API_BASE_URL}/tasks/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: editTitle }),
    });

    setEditId(null);
    setEditTitle("");
    fetchTasks();
  };

  /* ---------------- DELETE TASK ---------------- */
  const deleteTask = async (id) => {
    await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTasks((prev) => prev.filter((task) => task._id !== id));
  };


  const markCompleted = async (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task._id === taskId ? { ...task, status: "Completed" } : task
      )
    );

    await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: "Completed" }),
    });

    setTasks((prev) => prev.filter((t) => t.status !== "Completed"));
  };

  return (
  <>
    <Navbar />

    <div className="container mt-4">
      {/* PAGE TITLE */}
      <h2 className="text-center mb-4">Tasks</h2>

      {/* CREATE + FILTER CARD */}
      <div className="row justify-content-center">
        <div className="col-xl-9 col-lg-10 col-md-12">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">

              {/* FILTERS - TOP */}
              <div className="row g-2 mb-3">
                <div className="col-md-3 col-sm-6">
                  <select
                    className="form-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="Todo">Todo</option>
                    <option value="In progress">In progress</option>
                  </select>
                </div>

                <div className="col-md-3 col-sm-6">
                  <select
                    className="form-select"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="col-md-3 col-sm-6">
                  <select
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="createdAt">Newest</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>

                <div className="col-md-3 col-sm-6">
                  <input
                    className="form-control"
                    placeholder="Search by title"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <hr />

              {/* CREATE TASK FORM */}
              <form onSubmit={createTask}>
                <div className="row g-2 mb-2">
                  <div className="col-md-6">
                    <input
                      className="form-control"
                      placeholder="Task title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <input
                      type="date"
                      className="form-control"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row g-2 mb-2">
                  <div className="col-md-12">
                    <textarea
                      className="form-control"
                      placeholder="Description"
                      rows="2"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-md-4 col-sm-6">
                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In progress">In progress</option>
                    </select>
                  </div>

                  <div className="col-md-4 col-sm-6">
                    <select
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-end">
                  <button className="btn btn-primary px-4">
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>


      <h5 className="mb-3 text-muted">Active Tasks</h5>

      {loading && <Loader />}

      {!loading && error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {!loading && tasks.length === 0 && (
        <p className="text-muted">No active tasks</p>
      )}

      {!loading && tasks.length > 0 && (
        <ul className="list-group mb-4">
          {tasks.map((task) => (
            <li key={task._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">

                <div className="d-flex align-items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.status === "Completed"}
                    onChange={() => markCompleted(task._id)}
                  />

                  {editId === task._id ? (
                    <input
                      className="form-control"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  ) : (
                    <div>
                      <strong>{task.title}</strong>
                      <div className="text-muted small">
                        {task.description} • {task.priority}
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex gap-2">
                  {editId === task._id ? (
                    <>
                      <button
                        className="btn btn-sm btn-success"
                        onClick={updateTask}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-sm btn-outline-info"
                        onClick={() => startEdit(task)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteTask(task._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </>
);

};

export default Tasks