import dbConnect from "@/lib/dbconfig";
import UserModal from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const queryParams = { username: searchParams.get("username") };
    // validat with zod
    const result = usernameQuerySchema.safeParse(queryParams);
    // result = { success: true, data: { username: 'asfandyar' } }
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModal.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is available",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error Checking username",
      },
      { status: 500 }
    );
  }
}
// we will check unique username by getting username from query parameter
