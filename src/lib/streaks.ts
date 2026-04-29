export function calculateCurrentStreak(completions: string[], today?: string): number {
  const targetDate = today || new Date().toISOString().split('T')[0];
  
  // remove duplicates and sort by date descending
  const sortedUnique = Array.from(new Set(completions)).sort().reverse();

  if (!sortedUnique.includes(targetDate)) {
    return 0;
  }

  let streak = 0;
  // Use UTC dates to avoid timezone issues when comparing YYYY-MM-DD
  const current = new Date(targetDate + 'T00:00:00Z');

  for (const dateStr of sortedUnique) {
    const date = new Date(dateStr + 'T00:00:00Z');
    
    if (date.getTime() === current.getTime()) {
      streak++;
      current.setUTCDate(current.getUTCDate() - 1);
    } else if (date.getTime() < current.getTime()) {
      break;
    }
  }

  return streak;
}

