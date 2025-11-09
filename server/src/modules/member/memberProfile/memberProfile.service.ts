import prisma from "../../../utils/prisma-only.js";
import { UpdateMemberProfileInput } from "./memberProfile.schema.js";

export class MemberProfileService {
  async getProfile(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone_number: true,
        birth_date: true,
        address: true,
        avatar: true,
        role: true,
      },
    });
  }

  async updateProfile(userId: string, data: UpdateMemberProfileInput) {
    return await prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async deleteAccount(userId: string) {
    return await prisma.user.delete({
      where: { id: userId },
    });
  }
}
