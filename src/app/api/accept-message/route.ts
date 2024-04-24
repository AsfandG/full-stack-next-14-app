import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbconfig";
import UserModal from "@/models/User";
import { User } from "next-auth";
import { handleResponse } from "@/helpers/handleResponse";

// Function to toggle the accept message for loggedIn User.
export async function POST(req: Request) {
  await dbConnect();

  // currently loggedIn User.
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; // Giving the user a type is totally optional. you can avoid

  if (!session || session.user) {
    handleResponse(false, "Not Authenticated", 401);
  }

  const userId = user._id;
  const { acceptMessage } = await req.json();

  try {
    const updatedUser = await UserModal.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
      handleResponse(
        false,
        "Failed to update user status to accept Message",
        401
      );
    }

    handleResponse(true, "Message acceptance updated successfully!", 200);
  } catch (error) {
    handleResponse(false, "Failed to update user to accept Message", 500);
  }
}

export async function GET(request: Request) {
  await dbConnect();

  // currently loggedIn User.
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; // Giving the user a type is totally optional. you can avoid

  if (!session || session.user) {
    handleResponse(false, "Not Authenticated", 401);
  }

  const userId = user._id;

  try {
    const foundUser = await UserModal.findById(userId);
    if (!foundUser) {
      handleResponse(false, "User not found!", 404);
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser?.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    handleResponse(false, "Error in getting message acceptance status", 500);
  }
}
