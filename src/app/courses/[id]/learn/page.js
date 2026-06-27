import { notFound } from "next/navigation";
import { getCourse, getLessons } from "@/lib/data";
import CoursePlayer from "@/components/courses/CoursePlayer";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const course = await getCourse(id);
  if (!course) return { title: "Course Not Found" };
  return {
    title: `${course.title} — Learn`,
    description: course.shortDescription ?? undefined,
  };
}

export default async function LearnPage({ params, searchParams }) {
  const { id } = await params;
  const sp = await searchParams;

  const [course, lessons] = await Promise.all([getCourse(id), getLessons(id)]);

  if (!course) notFound();
  if (!lessons.length) notFound();

  // Default to first lesson, or lesson from query param
  const activeId = sp?.lesson ?? lessons[0]._id;
  const activeLesson = lessons.find((l) => l._id === activeId) ?? lessons[0];

  return (
    <CoursePlayer
      course={course}
      lessons={lessons}
      initialLesson={activeLesson}
      courseId={id}
    />
  );
}