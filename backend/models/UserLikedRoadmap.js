// backend/models/UserLikedRoadmap.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class UserLikedRoadmap extends Model {}
UserLikedRoadmap.init(
  {
    userId:    { type: DataTypes.INTEGER, allowNull: false },
    roadmapId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    modelName: "UserLikedRoadmap",
    tableName: "user_liked_roadmaps",
    timestamps: true,
    indexes: [{ unique: true, fields: ["userId", "roadmapId"] }],
  }
);

export default UserLikedRoadmap;
