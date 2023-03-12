import sequelize from "../config/database.mjs";
import { DataTypes, Model } from "sequelize";

export default class Role extends Model { }

Model.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Role'
})