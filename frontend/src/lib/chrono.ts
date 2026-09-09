const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  sept: 8,
  oct: 9,
  nov: 10,
  dec: 11,
  spring: 0,
  summer: 5,
  fall: 8,
  winter: 11,
}

const PRESENT = Number.MAX_SAFE_INTEGER

function parsePoint(raw: string): number {
  const value = raw.trim()
  if (!value) return 0
  if (/^present$/i.test(value)) return PRESENT

  const term = value.match(/^(spring|summer|fall|winter)\s+(\d{4})$/i)
  if (term) {
    return Date.UTC(Number(term[2]), MONTHS[term[1].toLowerCase()], 1)
  }

  const monthYear = value.match(/^([A-Za-z]+)\s+(\d{4})$/)
  if (monthYear) {
    const month = MONTHS[monthYear[1].toLowerCase()]
    return Date.UTC(Number(monthYear[2]), month ?? 0, 1)
  }

  const year = value.match(/^(\d{4})$/)
  if (year) return Date.UTC(Number(year[1]), 0, 1)

  return 0
}

export function parseRange(duration: string): { start: number; end: number } {
  const parts = duration.split(/\s*[-\u2013\u2014]\s*/).map((part) => part.trim()).filter(Boolean)
  const start = parsePoint(parts[0] ?? '')
  const end = parts[1] ? parsePoint(parts[1]) : start
  return { start, end }
}

/** Newest first: later end date wins, then later start. "Present" sorts above everything. */
export function compareChrono(a: string, b: string): number {
  const left = parseRange(a)
  const right = parseRange(b)
  if (right.end !== left.end) return right.end - left.end
  return right.start - left.start
}

export function sortByDuration<T>(items: readonly T[], duration: (item: T) => string): T[] {
  return [...items].sort((a, b) => compareChrono(duration(a), duration(b)))
}
