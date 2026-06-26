// src/models/lesson.js

export function createLesson(data) {
  return {
    courseId: data.courseId,
    title: data.title,
    description: data.description,
    bunnyVideoId: data.bunnyVideoId,
    order: data.order,
    isPreview: data.isPreview || false,
    status: "processing",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}