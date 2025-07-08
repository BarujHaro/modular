import {Sequelize} from "sequelize";
import db from "../config/database.js";
//Se importa la conexion a la base de datos

const {DataTypes} = Sequelize;

const User = db.define('user',{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(200),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    avatar_url: {
        type: DataTypes.STRING(255),
    },
    role: {
        type: DataTypes.ENUM("admin", "user"), 
        defaultValue: "user",
        
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, 
    },
    emailToken: {
    type: DataTypes.STRING,
},

},{
    freezeTableName:true,  //sequelize no va a pluralizar no cambia de user a users
    timestamps: false, //no agrega automaticamente createdAt
    underscored: true  //evita que use snake_case
});

//Aqui se crean las relaciones 
//hasOne es una relacion uno a uno, la llave foranea  se define en el modelo objetivo
//belongsTo relacion de uno a uno, la llave foranea  se define en el modelo origen
//hasMany relacion uno a muchos, la llave foranea se define en el modelo objetivo
//belongstoMany relacion muchos a muchos
User.associate = function(models) {
    if (!models?.Resource) return;
    User.hasMany(models.Resource, {
        foreignKey: 'user_id',
        as: 'created_resources' // Relación: User → Resources (creados)
    });
    if (!models?.Rating) return;
    User.hasMany(models.Rating, {
        foreignKey: 'user_id',
        as: 'ratings_given' // Relación: User → Ratings (hechos por el usuario)
    });
    //si no existen los modelos no se crean las relaciones
    if (!models?.Favorite || !models?.Resource) return;
    //un uusario puede tener muchos recursos marcados como favoritos y un recurso puede ser favorito de muchos
    User.belongsToMany(models.Resource, {
        through: models.Favorite, //atraves de la tabla intermedia(modelo de union)
        foreignKey: 'user_id', //Dentro de la tabla Favorite, el campo de referencia al User es user_id
        as: 'favorite_resources' //define como acceder a esta relacion desde la instancia de user
    // Relación: User ↔ Resources (favoritos)
    });
};



export default User;
