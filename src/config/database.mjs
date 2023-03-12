import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const { host, database, user, password, port } = process.env;
const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: 'mysql',
});

export default sequelize;