export type Habit = {
  id: string
  title: string
  color: string
  history: Record<string, boolean>
  createdAt: string
}

const STORAGE_KEY = 'habit-tracker::habits'
const isBrowser = typeof window !== 'undefined'

export const loadHabits = (): Habit[] => {
  if (!isBrowser) return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Habit[]) : []
  } catch (error) {
    console.error('Failed to load habits', error)
    return []
  }
}

export const saveHabits = (habits: Habit[]) => {
  if (!isBrowser) return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(habits))
  } catch (error) {
    console.error('Failed to save habits', error)
  }
}
