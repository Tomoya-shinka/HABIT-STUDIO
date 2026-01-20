'use client'

interface ProgressChartProps {
  data: number[]
  label: string
  color: string
}

export default function ProgressChart({ data, label, color }: ProgressChartProps) {
  const maxValue = Math.max(...data, 1)
  const weekDays = ['月', '火', '水', '木', '金', '土', '日']

  return (
    <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{label}</h3>
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((value, index) => {
          const height = (value / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="relative w-full h-full flex items-end">
                <div
                  className="w-full rounded-t-lg transition-all duration-500 ease-out hover:opacity-80"
                  style={{
                    height: `${height}%`,
                    backgroundColor: color,
                    minHeight: value > 0 ? '8px' : '0px',
                  }}
                >
                  {value > 0 && (
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                      {value}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">{weekDays[index]}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">今週の合計</span>
          <span className="text-lg font-bold" style={{ color }}>
            {data.reduce((a, b) => a + b, 0)}
          </span>
        </div>
      </div>
    </div>
  )
}
