'use client'

import { useEffect, useMemo, useState } from 'react'

import HabitCard from '@/components/HabitCard'
import { Habit, loadHabits, saveHabits } from '@/lib/storage'

const palette = ['#38bdf8', '#6366f1', '#8b5cf6', '#14b8a6', '#f472b6']
const quotes = [
  {
    text: '習慣は、最高の召使いにも最悪の主人にもなる。',
    author: 'ナサニエル・エモンズ',
  },
  {
    text: '私たちは繰り返し行うことの総体である。ゆえに卓越とは行為ではなく習慣である。',
    author: 'アリストテレス',
  },
  {
    text: 'モチベーションが続かないなら、習慣にしてしまえばいい。',
    author: 'ジェームズ・クリア',
  },
  {
    text: '小さな改善を毎日続ければ、やがて大きな成果になる。',
    author: 'ロバート・コリアー',
  },
  {
    text: '規律とは、今やるべきことをやることだ。',
    author: 'アブラハム・リンカーン',
  },
  {
    text: '今日できることを、決して明日に延ばすな。',
    author: 'ベンジャミン・フランクリン',
  },
] as const

type Day = {
  date: string
  label: string
  isToday: boolean
}

const formatDateKey = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const getLast7Days = (): Day[] => {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0=Sun
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const start = new Date(today)
  start.setDate(today.getDate() + offsetToMonday)

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    return {
      date: formatDateKey(date),
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: formatDateKey(date) === formatDateKey(today),
    }
  })
}

const getMonthMatrix = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)

  const firstDow = first.getDay() // 0=Sun
  const offsetToMonday = firstDow === 0 ? -6 : 1 - firstDow
  const start = new Date(year, month, 1 + offsetToMonday)
  const weeks: { date: string; day: number; inMonth: boolean }[] = []

  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    weeks.push({
      date: formatDateKey(d),
      day: d.getDate(),
      inMonth: d.getMonth() === month,
    })
  }

  return {
    label: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    days: weeks,
  }
}

const getStreak = (habit: Habit) => {
  let streak = 0
  const cursor = new Date()
  while (true) {
    const key = formatDateKey(cursor)
    if (habit.history?.[key]) {
      streak += 1
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [ready, setReady] = useState(false)
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [quoteVisible, setQuoteVisible] = useState(true)

  const days = useMemo(getLast7Days, [])
  const monthMatrix = useMemo(getMonthMatrix, [])

  useEffect(() => {
    const initial = loadHabits()
    setHabits(initial)
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) saveHabits(habits)
  }, [habits, ready])

  useEffect(() => {
    const interval = window.setInterval(() => {
      setQuoteVisible(false)
      window.setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length)
        setQuoteVisible(true)
      }, 250)
    }, 10_000)
    return () => window.clearInterval(interval)
  }, [])

  const handleAddHabit = () => {
    const title = newTitle.trim()
    if (!title) return
    const color = palette[habits.length % palette.length]
    const habit: Habit = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      title,
      color,
      history: {},
      createdAt: new Date().toISOString(),
    }
    setHabits((prev) => [habit, ...prev])
    setNewTitle('')
  }

  const handleToggleDay = (habitId: string, date: string) => {
    const todayKey = formatDateKey(new Date())
    if (date !== todayKey) return
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit
        const nextHistory = { ...habit.history }
        nextHistory[date] = !nextHistory[date]
        return { ...habit, history: nextHistory }
      }),
    )
  }

  const cards = habits.map((habit) => {
    const streak = getStreak(habit)
    const mapped = days.map((d) => ({ ...d, done: Boolean(habit.history?.[d.date]) }))
    const total = mapped.filter((d) => d.done).length
    return { habit, days: mapped, streak, total }
  })

  const dayCounts = days.map((d) => {
    const count = habits.reduce((sum, h) => (h.history?.[d.date] ? sum + 1 : sum), 0)
    return { ...d, count }
  })

  const historySet = new Set<string>()
  habits.forEach((h) => {
    Object.entries(h.history || {}).forEach(([date, done]) => {
      if (done) historySet.add(date)
    })
  })

  const totalCheckins = cards.reduce((sum, item) => sum + item.total, 0)
  const maxHabits = Math.max(1, habits.length)

  return (
    <main className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(56,189,248,0.22),transparent_45%),radial-gradient(900px_circle_at_80%_10%,rgba(99,102,241,0.18),transparent_40%),linear-gradient(to_bottom,#05070d,#070a12,#04060c)] py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-7 shadow-md">
          <div className="absolute inset-0 bg-[radial-gradient(600px_circle_at_20%_10%,rgba(56,189,248,0.3),transparent_55%),radial-gradient(500px_circle_at_80%_20%,rgba(99,102,241,0.2),transparent_55%)]" />
          <div className="relative space-y-2">
            <p className="uppercase text-xs font-semibold tracking-[0.28em] text-sky-200/90">
              HABIT STUDIO
            </p>
            <h1 className="text-4xl font-semibold text-white tracking-tight">続く習慣を作ろう。</h1>
            <div
              className={`mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur transition-opacity duration-300 ${
                quoteVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <p className="text-slate-200 text-sm leading-relaxed">“{quotes[quoteIndex].text}”</p>
              <p className="text-slate-400 text-xs mt-1">— {quotes[quoteIndex].author}</p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur-md p-5 sm:p-6 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Overview</p>
              <p className="text-2xl font-semibold text-white tracking-tight">
                {habits.length} habits
                <span className="text-slate-400 text-base font-medium ml-2">· {totalCheckins} check-ins (last 7 days)</span>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddHabit()
                }
              }}
              placeholder="Add a habit… (e.g. Stretch, Read, Meditate)"
              className="flex-1 rounded-2xl border border-white/10 bg-slate-800/40 backdrop-blur-sm px-4 py-3 text-slate-100 font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={handleAddHabit}
              className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-600 active:translate-y-[1px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500 focus-visible:ring-offset-[#05070d]"
            >
              Add
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white tracking-tight">Your habits</h2>
          </div>

          {cards.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/6 backdrop-blur p-10 text-center text-slate-400 shadow-sm">
              No habits yet. Add your first one above.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {cards.map(({ habit, days, streak }) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  days={days}
                  streak={streak}
                  onToggle={(date) => handleToggleDay(habit.id, date)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white tracking-tight">Weekly progress</h2>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur p-6 sm:p-8 shadow-sm overflow-hidden">
            <div className="flex gap-4">
              {/* Y axis */}
              <div className="flex flex-col justify-between text-[10px] text-slate-500 font-medium pt-2 min-w-[2.25rem]">
                <span className="text-right">{maxHabits}</span>
                <span className="text-right">0</span>
              </div>

              {/* Plot + X axis */}
              <div className="flex-1">
                <div className="relative h-40 pt-2">
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pt-2 pointer-events-none">
                    <div className="border-t border-white/5 w-full" />
                    <div className="border-t border-white/5 w-full" />
                    <div className="border-t border-white/5 w-full" />
                  </div>

                  {/* Bars */}
                  <div className="relative grid grid-cols-7 gap-3 items-end h-full">
                    {dayCounts.map((d) => {
                      const heightPercent = Math.min(100, (d.count / maxHabits) * 100)
                      return (
                        <div key={d.date} className="flex items-end justify-center h-full">
                          <div
                            style={{ height: `${heightPercent}%`, minHeight: d.count > 0 ? '4px' : '0' }}
                            className={`w-full max-w-[2.5rem] rounded-t-lg transition-all duration-500 ease-out ${
                              d.count > 0 ? 'bg-sky-500 shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'bg-white/5'
                            }`}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* X axis labels + counts */}
                <div className="grid grid-cols-7 gap-3 mt-4">
                  {dayCounts.map((d) => (
                    <div key={d.date} className="flex flex-col items-center gap-1">
                      <span className="text-[11px] text-slate-400 font-medium">{d.label}</span>
                      <span className={`text-xs font-bold ${d.count > 0 ? 'text-sky-400' : 'text-slate-600'}`}>
                        {d.count}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-slate-500 mt-6 text-center tracking-wide uppercase font-semibold opacity-60">
                  Activity overview for the current week
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white tracking-tight">Calendar (read-only)</h2>
            <p className="text-sm text-slate-400">{monthMatrix.label}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/6 backdrop-blur p-5 shadow-sm">
            <div className="grid grid-cols-7 gap-2 text-[11px] text-slate-400 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <span key={d} className="text-center font-semibold tracking-tight">
                  {d}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {monthMatrix.days.map((d) => {
                const done = historySet.has(d.date)
                return (
                  <div
                    key={d.date}
                    className={`h-12 rounded-xl border text-sm flex flex-col items-center justify-center ${
                      done
                        ? 'bg-sky-500/70 text-white border-sky-400/70 shadow-sm'
                        : 'bg-white/6 text-slate-400 border-white/10'
                    } ${d.inMonth ? '' : 'opacity-50'}`}
                    aria-hidden
                  >
                    <span className="text-xs">{d.day}</span>
                    {done && <span className="text-[10px]">✓</span>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
