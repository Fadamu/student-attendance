import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  getSessionCookieName,
  verifySession,
} from "@/lib/auth";

export async function getAuthenticatedStudent() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    getSessionCookieName(),
  )?.value;

  if (!token) {
    return null;
  }

  const session = await verifySession(token);

  if (!session) {
    return null;
  }

  const student = await prisma.student.findUnique({
    where: {
      id: session.studentId,
    },
    select: {
      id: true,
      fullName: true,
      matricNumber: true,
      email: true,
      department: true,
      level: true,
    },
  });

  return student;
}
