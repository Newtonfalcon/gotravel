// src/app/blogs/[id]/loading.jsx
import { Bone } from "@/components/ui/Skeleton";

export default function PostLoading() {
  return (
    <div className="min-h-screen bg-white" aria-busy="true" aria-label="Loading post">
      <div className="bg-stone-950 px-4 pb-32 pt-40 sm:px-6 sm:pt-48">
        <div className="mx-auto max-w-4xl space-y-4">
          <Bone dark className="h-4 w-24" />
          <Bone dark className="mt-8 h-12 w-full sm:h-14" />
          <Bone dark className="h-12 w-2/3 sm:h-14" />
          <Bone dark className="mt-6 h-9 w-56 rounded-full" />
        </div>
      </div>
      <div className="relative z-10 mx-auto -mt-24 max-w-5xl px-4 sm:px-6">
        <Bone className="aspect-[16/9] w-full rounded-3xl" />
      </div>
      <div className="mx-auto max-w-[44rem] space-y-4 px-5 py-14 sm:px-6">
        {Array.from({ length: 7 }).map((_, index) => (
          <Bone key={index} className={index % 4 === 3 ? "h-5 w-2/3" : "h-5 w-full"} />
        ))}
      </div>
    </div>
  );
}