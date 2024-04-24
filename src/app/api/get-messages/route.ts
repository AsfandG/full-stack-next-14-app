import { handleResponse } from "@/helpers/handleResponse";
import dbConnect from "@/lib/dbconfig";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModal from "@/models/User";

export async function GET(req: Request) {
  await dbConnect();

  // currently loggedIn User.
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; // Giving the user a type is totally optional. you can avoid

  if (!session || session.user) {
    handleResponse(false, "Not Authenticated", 401);
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModal.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!user || user.length === 0) {
      handleResponse(false, "User not found", 404);
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {}
}
