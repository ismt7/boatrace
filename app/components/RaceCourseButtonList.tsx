import React from "react";

function RaceCourseButton({
  course,
  isSelected,
  onClick,
}: {
  course: { id: number; name: string };
  isSelected: boolean;
  onClick: (id: number) => void;
}) {
  return (
    <button
      className={`py-2 px-4 m-1 whitespace-nowrap ${
        isSelected
          ? "border-b-2 border-blue-500 text-blue-500"
          : "text-gray-700"
      }`}
      onClick={() => onClick(course.id)}
    >
      {course.name}
    </button>
  );
}

export default function RaceCourseButtonList({
  courses,
  selectedId,
  onClick,
  scrollRef,
}: {
  courses: { id: number; name: string }[];
  selectedId: number;
  onClick: (id: number) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className="flex mb-4 border-b overflow-x-auto custom-scrollbar"
      ref={scrollRef}
    >
      {courses.map((course) => (
        <RaceCourseButton
          key={course.id}
          course={course}
          isSelected={selectedId === course.id}
          onClick={onClick}
        />
      ))}
    </div>
  );
}
