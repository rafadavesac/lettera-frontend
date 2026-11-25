// Períodos de vendas no formato do back (GET /ws/orders/sales?period=AAAA-MM).
// Funções puras. Custo: O(1) cada; lastPeriods é O(count).

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Date -> "2026-11".
export function toPeriod(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Os últimos `count` meses, do mais recente ao mais antigo.
export function lastPeriods(count = 12, now = new Date()) {
  return Array.from({ length: count }, (_, i) =>
    toPeriod(new Date(now.getFullYear(), now.getMonth() - i, 1))
  );
}

// "2026-11" -> "nov/2026".
export function formatPeriod(period) {
  return `${MONTHS[Number(period.slice(5, 7)) - 1]}/${period.slice(0, 4)}`;
}