import sequelize from "../config/database.mjs";
import { DataTypes, Model } from "sequelize";
import User from './user.mjs';

export default class Transaction extends Model {
    getDate() {
        return new Date(this.getDataValue("createdAt")).toLocaleDateString("es-AR")
    }
}

Transaction.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Transaction',
    timestamps: true,
    updatedAt: false,
});