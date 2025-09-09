// backend/models/index.js
import sequelize from "../config/database.js";

// Modelos base
import User from "./UserModel.js";

// Taxonomía
import Tag from "./Tag.js";
import Roadmap from "./Roadmap.js";
import RoadmapTag from "./RoadmapTag.js";

// Likes (IMPORTA y EXPORTA estos dos)
import UserLikedTag from "./UserLikedTag.js";
import UserLikedRoadmap from "./UserLikedRoadmap.js";

export const setupAssociations = () => {
  // Roadmap ↔ Tag (N–N) sin FKs en MySQL (constraints:false) para estabilizar en dev
  Roadmap.belongsToMany(Tag, {
    through: RoadmapTag,
    foreignKey: "roadmapId",
    otherKey: "tagId",
    constraints: false,
  });
  Tag.belongsToMany(Roadmap, {
    through: RoadmapTag,
    foreignKey: "tagId",
    otherKey: "roadmapId",
    constraints: false,
  });

  // User ↔ Tag (likes)
  User.belongsToMany(Tag, {
    through: UserLikedTag,
    foreignKey: "userId",
    otherKey: "tagId",
    as: "likedTags",
    constraints: false,
  });
  Tag.belongsToMany(User, {
    through: UserLikedTag,
    foreignKey: "tagId",
    otherKey: "userId",
    constraints: false,
  });

  // User ↔ Roadmap (likes)
  User.belongsToMany(Roadmap, {
    through: UserLikedRoadmap,
    foreignKey: "userId",
    otherKey: "roadmapId",
    as: "likedRoadmaps",
    constraints: false,
  });
  Roadmap.belongsToMany(User, {
    through: UserLikedRoadmap,
    foreignKey: "roadmapId",
    otherKey: "userId",
    constraints: false,
  });
};

export const syncModels = async () => {
  await sequelize.query("SET FOREIGN_KEY_CHECKS=0;");

  // Padres
  await User.sync();
  await Tag.sync();
  await Roadmap.sync();

  // Puente + likes
  await RoadmapTag.sync();
  await UserLikedTag.sync();
  await UserLikedRoadmap.sync();

  await sequelize.query("SET FOREIGN_KEY_CHECKS=1;");
};

// 👇 ahora sí exporta también los “likes”
export {
  sequelize,
  User,
  Tag,
  Roadmap,
  RoadmapTag,
  UserLikedTag,
  UserLikedRoadmap,
};
