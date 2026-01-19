const express = require("express")

const authMiddleware = require("../middlewares/authMiddleware")

const { createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus } = require("../controllers/taskControllers")

const router = express.Router()

router.use(authMiddleware)

router.post("/", createTask)
router.get('/', getAllTasks)
router.get("/:id", getTaskById)
router.put("/:id", updateTask)
router.delete("/:id", deleteTask)
router.patch("/:id/status", updateTaskStatus);



module.exports = router