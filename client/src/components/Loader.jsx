export function LoaderFull() {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <Spinner />
    </div>
  )
}

export function Spinner() {
  return (
    <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
  )
}
