import prisma from "../../utils/prisma-only.js";

export class AdminMemberService {
  /**
   * 取得所有會員列表
   */
  async getAllMembers() {
    const members = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        is_active: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return members;
  }
}