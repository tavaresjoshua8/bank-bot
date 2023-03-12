import sequelize from "../config/database.mjs";
import { DataTypes, Model } from "sequelize";

export default class User extends Model {}

User.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    nickname: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: 'User'
});