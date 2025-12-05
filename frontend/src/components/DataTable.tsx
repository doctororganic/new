export type Column<T> = { key: keyof T; label: string; align?: 'left'|'right' }

export default function DataTable<T extends Record<string, any>>({ rows, columns, linkKey }: { rows: T[]; columns: Column<T>[]; linkKey?: keyof T }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-50">
            {columns.map(col => (
              <th key={String(col.key)} className={`p-2 text-${col.align === 'right' ? 'right' : 'left'}`}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, i) => (
            <tr key={i} className="border-t">
              {columns.map(col => (
                <td key={String(col.key)} className={`p-2 ${col.align === 'right' ? 'text-right' : ''}`}>
                  {linkKey && col.key === 'name' ? (
                    <a href={`/${String(linkKey).split('.')[0]}/${row.id}`} className="text-blue-700 underline">{row[col.key]}</a>
                  ) : (
                    row[col.key] as any
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

