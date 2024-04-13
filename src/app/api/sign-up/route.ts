import dbConnect from "@/lib/dbconfig";
import UserModal from "@/models/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST() {
  await dbConnect();
  try {
  } catch (error) {
    console.error("Error while registering the user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
