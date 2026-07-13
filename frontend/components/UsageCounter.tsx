"use client";

export default function UsageCounter({
  freeUses,
}: {
  freeUses: number;
}) {
  return (
    <p className="text-sm text-gray-600 mt-4">
      Free AI Generations Left: <b>{freeUses}</b> / 3
    </p>
  );
}