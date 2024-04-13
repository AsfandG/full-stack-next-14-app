import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery message | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return { success: true, message: "Verification Email sent successfully!" };
  } catch (error) {
    console.log("Error sending verification Email!", error);
    return { success: false, message: "Failed to send verification email" };
  }
}
