import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { ANALYTICS_BASE_URL } from "../config/env";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) {
        setLoading(false);
        return;
        }

        const fetchAnalytics = async () => {
        try {
            const statsRes = await fetch(
            `${ANALYTICS_BASE_URL}/user/${userId}`
            );
            const statsData = await statsRes.json();

            const trendRes = await fetch(
            `${ANALYTICS_BASE_URL}/productivity/${userId}`
            );
            const trendData = await trendRes.json();

            setStats(statsData);
            setTrend(trendData.dailyCompletion || []);
        } catch (error) {
            console.error("Failed to load analytics", error);
        } finally {
            setLoading(false);
        }
        };

        fetchAnalytics();
    }, [userId]);

    if (loading) return <Loader />;

    /* ---------------- CHART DATA ---------------- */

    const priorityChartData = stats
        ? {
            labels: ["High", "Medium", "Low"],
            datasets: [
            {
                label: "Tasks",
                data: [
                stats.priorityDistribution?.High || 0,
                stats.priorityDistribution?.Medium || 0,
                stats.priorityDistribution?.Low || 0,
                ],
                backgroundColor: ["#dc3545", "#ffc107", "#198754"],
            },
            ],
        }
        : null;

    const productivityChartData = {
        labels: trend.map((t) => t.date),
        datasets: [
        {
            label: "Tasks Completed",
            data: trend.map((t) => t.completed),
            backgroundColor: "#0d6efd",
        },
        ],
    };

    const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        position: "bottom",
        labels: {
            boxWidth: 12,
            padding: 15,
        },
        },
    },
    };

    const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
        display: false,
        },
    },
    scales: {
        y: {
        beginAtZero: true,
        ticks: {
            stepSize: 1,
        },
        },
    },
    };


    return (
        <>
        <Navbar />
        <div className="container mt-4">
            <h2 className="mb-4">Dashboard</h2>

            {/* ---------------- STATS CARDS ---------------- */}
            {stats && (
            <div className="row mb-4">
                <div className="col-md-3">
                <div className="card shadow-sm text-center">
                    <div className="card-body">
                    <h6 className="text-muted">Total Tasks</h6>
                    <h3>{stats.totalTasks}</h3>
                    </div>
                </div>
                </div>

                <div className="col-md-3">
                <div className="card shadow-sm text-center">
                    <div className="card-body">
                    <h6>Completed</h6>
                    <h3 className="text-success">
                        {stats.completedTasks}
                    </h3>
                    </div>
                </div>
                </div>

                <div className="col-md-3">
                <div className="card shadow-sm text-center">
                    <div className="card-body">
                    <h6>Pending</h6>
                    <h3 className="text-warning">
                        {stats.pendingTasks}
                    </h3>
                    </div>
                </div>
                </div>

                <div className="col-md-3">
                <div className="card shadow-sm text-center">
                    <div className="card-body">
                    <h6>Completion Rate</h6>
                    <h3>{stats.completionRate}%</h3>
                    </div>
                </div>
                </div>
            </div>
            )}

            {/* ---------------- CHARTS SECTION ---------------- */}
                <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <h5 className="mb-3 text-center">
                                Priority Distribution
                            </h5>

                            {priorityChartData ? (
                            <div
                                className="flex-grow-1 d-flex justify-content-center align-items-center"
                                style={{ minHeight: "260px" }}
                            >
                                <div style={{ width: "260px", height: "260px" }}>
                                    <Pie
                                        data={priorityChartData}
                                        options={pieOptions}
                                    />
                                </div>
                            </div>
                            ) : (
                            <p className="text-muted text-center">
                                No data
                            </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Productivity Trend */}
                <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <h5 className="mb-3 text-center">
                                Productivity Trend
                            </h5>

                            {trend.length === 0 ? (
                            <p className="text-muted text-center">
                                No activity yet
                            </p>
                            ) : (
                            <div
                                className="flex-grow-1"
                                style={{ minHeight: "260px" }}
                            >
                                <Bar
                                data={productivityChartData}
                                options={barOptions}
                                />
                            </div>
                            )}
                        </div>
                    </div>
                </div>
                </div>

        </div>
        </>
    );
};

export default Dashboard