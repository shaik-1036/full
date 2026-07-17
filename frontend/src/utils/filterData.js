export function filterRecords(records, { query = '', dateFilter = 'all', statusFilter = 'all', categoryFilter = 'all' } = {}) {
  const normalizedQuery = query.trim().toLowerCase();

  return records.filter((record) => {
    const searchText = Object.values(record)
      .filter((value) => typeof value === 'string' || typeof value === 'number')
      .join(' ')
      .toLowerCase();

    const matchesQuery = !normalizedQuery || searchText.includes(normalizedQuery);

    const statusValue = record.status || record.payment_status || '';
    const matchesStatus = !statusFilter || statusFilter === 'all' || statusValue.toLowerCase() === statusFilter.toLowerCase();

    const categoryValue = record.category || '';
    const matchesCategory = !categoryFilter || categoryFilter === 'all' || categoryValue.toLowerCase() === categoryFilter.toLowerCase();

    const recordDateValue = record.created_at || record.updated_at || record.order_date || record.payment_date || record.return_date || record.shipped_at;
    const matchesDate = (() => {
      if (!recordDateValue || dateFilter === 'all') return true;
      const recordDate = new Date(recordDateValue);
      if (Number.isNaN(recordDate.getTime())) return true;

      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const startOfRange = new Date();

      if (dateFilter === 'today') {
        return recordDate >= startOfToday;
      }

      if (dateFilter === '7d') {
        startOfRange.setDate(today.getDate() - 7);
        return recordDate >= startOfRange;
      }

      if (dateFilter === '30d') {
        startOfRange.setDate(today.getDate() - 30);
        return recordDate >= startOfRange;
      }

      return true;
    })();

    return matchesQuery && matchesStatus && matchesCategory && matchesDate;
  });
}
