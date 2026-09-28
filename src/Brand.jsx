export default function Brand({ subtitle }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-9 h-9 bg-teal-700 rounded-lg flex items-center justify-center text-white font-bold">S</div>
      <div>
        <p className="font-bold text-teal-800 leading-none">SetuCare</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  )
}