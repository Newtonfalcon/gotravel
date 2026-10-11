// src/app/blogs/loading.jsx
import { Bone } from "@/components/ui/Skeleton";

export default function BlogsLoading() {
  return (
    <div className="min-h-screen bg-white" aria-busy="true" aria-label="Loading posts">
      <div className="bg-stone-950 px-4 pb-20 pt-40 sm:px-6 sm:pb-28 sm:pt-48 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-5">
          <Bone dark className="h-12 w-full max-w-xl sm:h-16" />
          <Bone dark className="h-12 w-3/5 max-w-sm sm:h-16" />
          <Bone dark className="mt-4 h-5 w-full max-w-md" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Bone className="h-12 w-full max-w-sm rounded-full" />
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4">
              <Bone className="aspect-[4/3] w-full rounded-2xl" />
              <Bone className="h-4 w-1/4" />
              <Bone className="h-6 w-5/6" />
              <Bone className="h-4 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}