from flask import Flask, jsonify, request
from flask_cors import CORS 
from db import task_collection
from bson import ObjectId
from datetime import datetime
import os

app = Flask(__name__)

CORS(app, resources={r"/analytics/*": {"origins": "*"}})

@app.route("/analytics/user/<user_id>", methods=["GET"])
def user_statistics (user_id):
    try:
        user_id = ObjectId(user_id)
        
        total_tasks = task_collection.count_documents({"userId": user_id})
        completed_tasks = task_collection.count_documents({
            "userId": user_id,
            "status": "Completed"
        })
        pending_tasks = total_tasks - completed_tasks
        completion_rate = round((completed_tasks/total_tasks) * 100, 2) if total_tasks > 0 else 0
        
        pipeline = [
            {"$match": {"userId": user_id}},
            {"$group": {"_id": "$priority", "count": {"$sum": 1}}}
        ]
        
        priority_data = task_collection.aggregate(pipeline)
        
        priority_distribution = {
            "Low": 0,
            "Medium": 0,
            "High": 0
        }
        
        for item in priority_data:
            priority_distribution[item["_id"]] = item["count"]
            
        return jsonify({
            "totalTasks": total_tasks,
            "completedTasks": completed_tasks,
            "pendingTasks": pending_tasks,
            "completionRate": completion_rate,
            "priorityDistribution": priority_distribution
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/analytics/productivity/<user_id>", methods=["GET"])
def productivity_trend(user_id):
    try:
        from_date = request.args.get('from')
        to_date = request.args.get('to')
        match_stage = {
            "userId": ObjectId(user_id),
            "status": "Completed"
        }
        
        if from_date and to_date:
            match_stage["updatedAt"] = {
                "$gte": datetime.fromisoformat(from_date),
                "$lte": datetime.fromisoformat(to_date)
            }
        pipeline = [
            {"$match": match_stage},
            {
                "$group": {
                    "_id":{
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": "$updatedAt"
                        }
                    },
                    "completed": {"$sum":1}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        
        results = task_collection.aggregate(pipeline)
        
        data = [{"date": r["_id"], "completed": r["completed"]} for r in results]
        return jsonify({"dailyCompletion": data})
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    import os
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        debug=False
    )