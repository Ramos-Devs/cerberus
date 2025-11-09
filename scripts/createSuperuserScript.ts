import prisma from "../src/db";
import { convertHashPassword } from "../src/utils/bcryptsPassword";
import { UserType } from "../src/constants/enums";
import { createNewUser } from "../src/models/userModel";

async function main() {
  const data = {
    username: String(process.env.SUPERADMIN_USERNAME),
    email: String(process.env.SUPERADMIN_EMAIL),
    displayName: "Superadmin",
    userType: UserType.SUPERADMIN,
    password: await convertHashPassword(String(process.env.SUPERADMIN_PASSWORD)),
  };

  try {
    await createNewUser(data);
  } catch {
    console.error("Error in creating the superuser");
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
