const Task = require('../models/Task')

// Create Task

const createTask = async (req, res) => {
    try{
        const {title, description, priority, status, dueDate} = req.body
        if(!title) {
            return res.status(400).json({message: "Title is required"})
        }
        const task = await Task.create({
            userId: req.userId,
            title,
            description,
            priority,
            status,
            dueDate
        })
        return res.status(201).json(task)
    } catch(e){
        console.log("Error in Creating Task", e)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

//Get Tasks with filters 

const getAllTasks = async (req, res) => {
    try{
        const {status, priority, search, sortBy} = req.query
        const query = {userId: req.userId}

        if (status) query.status = status
        if (priority) query.priority = priority
        if (search) query.title = {$regex: search, $options: "i"}
        let sortOptions = {createdAt: -1}

        if (sortBy === "dueDate") sortOptions = {dueDate: 1}
        if (sortBy === "priority") sortOptions = {priority: 1}
        if (sortBy === "createdAt") sortOptions = {createdAt: -1}

        const tasks = await Task.find(query).sort(sortOptions)
        res.json(tasks)
    } catch(e){
        console.log("Error in Getting Tasks", e)
        return res.status(500).json({message: "Internal server Error"})
    } 
}

const getTaskById = async (req, res) => {
    try{
        const task = await Task.findOne({
            _id: req.params.id,
            userId: req.userId
        })
        if(!task) {
            return res.status(404).json({message: "Task Not Found"})
        }
        return res.json(task)
    } catch(e){
        console.log("Get Task By Id Error", error)
        return res.status(500).json({message: "Internal server Error"})
    }
}

const updateTask = async (req, res) => {
    try {
        const task =  await Task.findOneAndUpdate(
            {_id: req.params.id, userId: req.userId}, req.body, {new: true}
        )

        if (!task) {
            res.status(400).json({message: "Task Not Found"})
        }
        return res.json(task)
    } catch (e){
        console.log("Error in Updating Task", e)
        return res.status(500).json({message: "Internal server Error"})
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id, userId: req.userId
        })
        if (!task) {
            res.status(400).json({message: "Task Not Found"})
        }
        return res.json({message: "Task Successfully Deleted"})
    } catch(e){
        console.log("Error in deleting Task", e)
        return res.status(500).json({message: "Internal Server Error"})
    }
}

const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        { status },
        { new: true }
        );

        if (!task) {
        return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (e) {
        console.log("Update status error", e);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskStatus
}