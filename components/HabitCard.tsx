'use client'

import { useEffect, useState } from 'react'

import { Habit } from '@/lib/storage'

type Day = { date: string; label: string; isToday: boolean; done: boolean }

type Props = {
  habit: Habit
  days: Day[]
  streak: number
  onToggle: (date: string) => void
}

const Flame = ({
  level,
  active,
  slashed = false,
  className = '',
}: {
  level: 0 | 1 | 2 | 3 | 4 | 5 | 6
  active: boolean
  slashed?: boolean
  className?: string
}) => {
  const sizeByLevel = [
    'w-5 h-5',
    'w-6 h-6',
    'w-7 h-7',
    'w-8 h-8',
    'w-9 h-9',
    'w-10 h-10',
    'w-11 h-11',
  ] as const

  return (
    <span className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className={`${sizeByLevel[level]} ${active ? 'animate-flame' : ''}`}
        aria-hidden="true"
      >
        <path
          d="M12 2c.6 2.6-.7 4.2-2 5.6C8.7 9 8 10.2 8 12c0 2.8 2.2 5 4.9 5 2.7 0 5.1-2.2 5.1-5.2 0-2.2-1.2-4-2.7-5.4-.9-.9-1.7-1.8-2.3-3.4Z"
        fill={active ? '#fb923c' : 'rgba(148,163,184,0.28)'}
        />
        <path
          d="M12.5 10.2c.2 1-.2 1.7-.7 2.2-.5.6-.8 1.1-.8 1.9 0 1.3 1 2.3 2.2 2.3 1.2 0 2.3-1 2.3-2.4 0-1-.6-1.8-1.2-2.4-.5-.4-.9-.9-1.1-1.6Z"
        fill={active ? 'rgba(255,237,213,0.85)' : 'rgba(148,163,184,0.12)'}
        />
      </svg>
      {slashed && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(135deg,transparent_46%,rgba(148,163,184,0.55)_48%,rgba(148,163,184,0.55)_52%,transparent_54%)]"
          aria-hidden="true"
        />
      )}
    </span>
  )
}

export default function HabitCard({ habit, days, streak, onToggle }: Props) {
  const doneCount = days.filter((d) => d.done).length
  const flameLevel = Math.min(6, Math.max(0, streak - 1)) as 0 | 1 | 2 | 3 | 4 | 5 | 6
  const [burstOn, setBurstOn] = useState(false)

  useEffect(() => {
    if (!burstOn) return
    const t = window.setTimeout(() => setBurstOn(false), 460)
    return () => window.clearTimeout(t)
  }, [burstOn])

  const parseDateKey = (key: string) => {
    const [y, m, d] = key.split('-').map((n) => Number(n))
    return new Date(y, m - 1, d)
  }

  const getStreakEndingAt = (dateKey: string) => {
    let count = 0
    const cursor = parseDateKey(dateKey)
    while (true) {
      const y = cursor.getFullYear()
      const m = String(cursor.getMonth() + 1).padStart(2, '0')
      const d = String(cursor.getDate()).padStart(2, '0')
      const key = `${y}-${m}-${d}`
      if (habit.history?.[key]) {
        count += 1
        cursor.setDate(cursor.getDate() - 1)
      } else {
        break
      }
    }
    return count
  }

  return (
    <div className="rounded-3xl p-6 shadow-lg border border-white/8 bg-white/6 backdrop-blur-md hover:bg-white/10 hover:-translate-y-[1px] transition-all">
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-2xl bg-white/10 text-white/90 font-semibold flex items-center justify-center border border-white/10">
            {habit.title.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Habit</p>
            <h3 className="text-lg font-semibold text-white tracking-tight">{habit.title}</h3>
            <p className="text-sm text-slate-400">{doneCount} / 7 check-ins</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Streak</p>
          <div className="flex items-center justify-end gap-2">
            <Flame level={flameLevel} active={streak > 0} className="drop-shadow" />
            <p className="text-xl font-semibold text-white">{streak} days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const checked = day.done
          const disabled = !day.isToday
          const dayStreak = checked ? getStreakEndingAt(day.date) : 0
          const dayFlameLevel = Math.min(6, Math.max(0, dayStreak - 1)) as 0 | 1 | 2 | 3 | 4 | 5 | 6
          return (
            <button
              key={day.date}
              onClick={() => {
                if (day.isToday) setBurstOn(true)
                onToggle(day.date)
              }}
              disabled={disabled}
              className={`group flex flex-col items-center gap-2 rounded-2xl px-2 py-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070d] disabled:cursor-not-allowed disabled:opacity-60 ${
                day.isToday ? 'bg-white/5 border border-white/10' : 'bg-transparent border border-transparent'
              }`}
              aria-pressed={checked}
              aria-label={`Toggle ${day.label}`}
            >
              <span className="tracking-tight text-[11px] text-slate-300">{day.label}</span>
              <span className="relative flex items-center justify-center">
                <Flame
                  level={checked ? dayFlameLevel : 0}
                  active={checked}
                  slashed={!checked && disabled}
                  className={`${checked && day.isToday ? 'animate-flame-pop' : ''} ${
                    burstOn && day.isToday ? 'animate-flame-burst' : ''
                  } scale-200`}
                />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
