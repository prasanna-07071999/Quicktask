import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* HERO SECTION */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h1 className="display-5 fw-bold mb-3">
            Manage Your Tasks Smarter with{" "}
            <span className="text-primary">QuickTask</span>
          </h1>

          <p className="lead mb-4">
            A simple, fast and powerful task management app
            to boost your daily productivity.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/login"
              className="btn btn-primary btn-lg"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-outline-secondary btn-lg"
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Why QuickTask?</h2>
          <p className="text-muted">
            Everything you need to plan, track and analyze your work.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4 col-sm-12">
            <div className="card h-100 shadow-sm text-center">
              <div className="card-body">
                <h4>📝 Task Management</h4>
                <p className="text-muted">
                  Create, edit, delete and organize your tasks easily.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-sm-12">
            <div className="card h-100 shadow-sm text-center">
              <div className="card-body">
                <h4>📊 Analytics</h4>
                <p className="text-muted">
                  Track productivity and completion trends with insights.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4 col-sm-12">
            <div className="card h-100 shadow-sm text-center">
              <div className="card-body">
                <h4>🔐 Secure</h4>
                <p className="text-muted">
                  JWT-based authentication with protected routes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
