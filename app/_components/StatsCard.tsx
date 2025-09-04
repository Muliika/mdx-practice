interface StatsCardProps {
  number: string
  label: string
}

export function StatsCard({ number, label }: StatsCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 text-center border border-blue-200 dark:border-blue-800">
      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
        {number}
      </div>
      <div className="text-gray-700 dark:text-gray-300 font-medium">
        {label}
      </div>
    </div>
  )
}