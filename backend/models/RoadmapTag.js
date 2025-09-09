import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class RoadmapTag extends Model {}
RoadmapTag.init(
  {
    roadmapId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    tagId:     { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    modelName: "RoadmapTag",
    tableName: "roadmap_tags",
    timestamps: false,
    indexes: [{ unique: true, fields: ["roadmapId", "tagId"] }],
  }
);
export default RoadmapTag;
