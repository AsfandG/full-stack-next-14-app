import dbConnect from "@/lib/dbconfig";
import UserModal from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();
    // optional line
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModal.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account Verified Successfully!",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verify code is expired. Please signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
