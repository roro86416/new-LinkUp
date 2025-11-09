import prisma from "../../../utils/prisma-only.js";
import bcrypt from "bcrypt";

export class AccountSettingsService {
  /**
   * Changes a user's password.
   * @param userId - The ID of the user.
   * @param passwordData - An object containing the current and new passwords.
   */
  async changePassword(
    userId: string,
    passwordData: { currentPassword: string; newPassword: string }
  ) {
    // 1. Retrieve the user from the database, including the password hash.
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password_hash) {
      throw new Error("找不到使用者或使用者未設定密碼");
    }

    // 2. Compare the provided current password with the stored hash.
    const isPasswordValid = await bcrypt.compare(
      passwordData.currentPassword,
      user.password_hash
    );

    if (!isPasswordValid) {
      throw new Error("原密碼不正確");
    }

    // 3. Hash the new password.
    const hashedNewPassword = await bcrypt.hash(passwordData.newPassword, 10);

    // 4. Update the password in the database.
    await prisma.user.update({
      where: { id: userId },
      data: { password_hash: hashedNewPassword },
    });
  }
}