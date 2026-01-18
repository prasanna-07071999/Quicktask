const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        descriptio: {
            type: String,
            trim: true,
        },
        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Medium"
        },
        status: {
            type: String,
            enum: ["Todo", "In progress", "Completed"],
            default: "Todo"
        },
        dueDate: {
            type: Date,
        }
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", taskSchema)