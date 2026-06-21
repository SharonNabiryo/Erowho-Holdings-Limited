'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Search, Edit2, Eye, Trash2, Globe, EyeOff, BookOpen } from 'lucide-react'
import { BLOG_POSTS } from '@/data'
import { cn } from '@/lib/utils'

const MOCK = BLOG_POSTS.map((p,i) => ({ ...p, status: i<4?'PUBLISHED':'DRAFT', views: [2840,1920,1540,1180,890,660][i] }))

export default function AdminBlogPage() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState('All')
  const [items, setItems] = useState(MOCK)

  const listed = items.filter(p => {
    const mq = !q || p.title.toLowerCase().includes(q.toLowerCase()) || p.author.toLowerCase().includes(q.toLowerCase())
    const mt = tab==='All' || p.status===tab.toUpperCase()
    return mq && mt
  })
  const toggleStatus = (id:string) => setItems(prev=>prev.map(p=>p.id===id?{...p,status:p.status==='PUBLISHED'?'DRAFT':'PUBLISHED'}:p))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={14} className="text-slate-400"/>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search posts…" className="text-sm font-dm placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent"/>
        </div>
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {['All','Published','Draft'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={cn('px-3 py-1.5 text-xs font-dm font-medium rounded-lg transition-all',tab===t?'bg-emerald-600 text-white':'text-slate-600 hover:bg-slate-100')}>{t}</button>
          ))}
        </div>
        <button className="ml-auto flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-dm font-medium rounded-xl transition-colors"><Plus size={15}/>New Post</button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {listed.map(post => (
          <div key={post.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-200">
            <div className="relative h-40">
              <Image src={post.coverImage} alt={post.title} fill className="object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
              <div className="absolute bottom-3 left-3 flex gap-1.5">
                <span className="text-[10px] font-dm font-bold px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur">{post.category}</span>
                <span className={cn('text-[10px] font-dm font-bold px-2 py-0.5 rounded-full', post.status==='PUBLISHED'?'bg-emerald-500 text-white':'bg-amber-500 text-white')}>
                  {post.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <p className="font-playfair font-bold text-slate-900 leading-snug mb-1 line-clamp-2">{post.title}</p>
              <p className="text-xs font-dm text-slate-500 mb-3">{post.author} · {post.readTime} · {(post as any).views?.toLocaleString()} views</p>
              <div className="flex items-center gap-2">
                <button onClick={()=>toggleStatus(post.id)} className={cn('flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-dm font-medium rounded-lg transition-colors',
                  post.status==='PUBLISHED'?'bg-amber-50 hover:bg-amber-100 text-amber-700':'bg-emerald-50 hover:bg-emerald-100 text-emerald-700')}>
                  {post.status==='PUBLISHED'?<><EyeOff size={12}/>Unpublish</>:<><Globe size={12}/>Publish</>}
                </button>
                <Link href={`/blog/${post.slug}`} target="_blank" className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-blue-600"><Eye size={13}/></Link>
                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-emerald-600"><Edit2 size={13}/></button>
                <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-red-500"><Trash2 size={13}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
