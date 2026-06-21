import type { Metadata } from "next"
export const metadata: Metadata = { title: "Owner Portal" }
export default function AdminPage() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
      <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🔧</span>
      </div>
      <h2 className="font-playfair text-2xl font-bold text-slate-900 mb-3">Owner Portal</h2>
      <p className="font-dm text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        Connect your PostgreSQL database and run <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs">npx prisma migrate dev</code> to activate this section. The service layer in <code className="text-emerald-700 bg-emerald-50 px-1 rounded text-xs">src/lib/services/index.ts</code> is fully implemented and ready.
      </p>
    </div>
  )
}
