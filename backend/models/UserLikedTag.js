// backend/models/UserLikedTag.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class UserLikedTag extends Model {}
UserLikedTag.init(
  {
    userId:  { type: DataTypes.INTEGER, allowNull: false },
    tagId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  },
  {
    sequelize,
    modelName: "UserLikedTag",
    tableName: "user_liked_tags",
    timestamps: true,
    indexes: [{ unique: true, fields: ["userId", "tagId"] }],
  }
);

export default UserLikedTag;
