import * as bcrypt from "bcrypt";
import { User } from "../../models/mysql";
import { UserRoles } from "../../interfaces";
import { sequelize } from "../../configs";

const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ force: true }); // just for testing environments
    console.log("All models were synchronized successfully.");

    // Encrypt and hash the password
    const password = "0000";
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({
      name: "admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      roles: [UserRoles.Admin],
    });
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  } finally {
    await sequelize.close();
  }
};

initDb().catch((error) => {
  console.error("Error in the database initialization script:", error);
});
