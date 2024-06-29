import * as bcrypt from "bcrypt";
import { User } from "../../models/sql";
import { UserRoles } from "../../interfaces";
import { sequelizeOrm } from "../../configs";

const initDb = async () => {
  try {
    await sequelizeOrm.connectDb();

    await sequelizeOrm.syncDb(true); // just for testing environments

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
    await sequelizeOrm.disconnectDb();
  }
};

initDb().catch((error) => {
  console.error("Error in the database initialization script:", error);
});
