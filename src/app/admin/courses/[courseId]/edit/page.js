import { notFound } from "next/navigation";
import { getAdminCourseWithLessons } from "@/lib/data";
import EditCourseForm from "@/components/admin/EditCourseForm";

export async function generateMetadata({ params }) {
  const { courseId } = await params;
  const result = await getAdminCourseWithLessons(courseId);
  if (!result) return { title: "Course Not Found — Admin" };
  return { title: `Edit: ${result.course.title} — Admin` };
}

export default async function EditCoursePage({ params }) {
  const { courseId } = await params;
  const result = await getAdminCourseWithLessons(courseId);

  if (!result) notFound();

  return <EditCourseForm course={result.course} courseId={courseId} />;
}
