import UserModal from "@/models/User";
import dbConnect from "@/lib/dbconfig";
import { Message } from "@/models/User";
import { handleResponse } from "@/helpers/handleResponse";

export async function POST(req: Request) {
  await dbConnect();

  const { username, content } = await req.json();
  try {
    const user = await UserModal.findOne({ username });

    if (!user) {
      handleResponse(false, "User not found", 404);
    }

    // if user is found. check either user is accepting message or not.
    if (!user?.isAcceptingMessage) {
      handleResponse(false, "User is not accepting messages", 403);
    }

    const newMessage = { content, createdAt: new Date() };
    // now push the message in the messages array of the user.
    user?.messages.push(newMessage as Message);
    await user?.save();
    handleResponse(true, "message sent successfully!", 201);
  } catch (error) {
    handleResponse(false, "Internal server error!", 500);
  }
}
