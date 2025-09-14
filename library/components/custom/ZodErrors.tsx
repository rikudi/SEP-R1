export function ZodErrors({ error }: { error: string[] | undefined }) {
  if (!error || error.length === 0) return null;
  return error.map((err: string, index: number) => (
    <div key={index} className="text-red-500 text-xs mt-1 py-2">
      {err}
    </div>
  ));
}
