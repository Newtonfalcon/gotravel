export default async function CourseBuilder({ params }) {
  const { courseId } = await params;

  return (
    <div>
      <h1>Course Builder</h1>
      <p>{courseId}</p>
    </div>
  );
}