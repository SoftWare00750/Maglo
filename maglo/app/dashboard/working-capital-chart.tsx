// app/dashboard/working-capital-chart.tsx
"use client"

import { useState, useMemo } from "react"
import { useMaglo } from "@/lib/context"
import { Card } from "../../components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

type TimeRange = "7" | "30" | "90"

export default function WorkingCapitalChart() {
  const { invoices } = useMaglo()
  const [timeRange, setTimeRange] = useState<TimeRange>("7")

  // Calculate income and expenses data based on invoices
  const chartData = useMemo(() => {
    const days = parseInt(timeRange)
    const today = new Date()
    const data = []

    // Generate date range
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      // Calculate income (paid invoices) for this date
      const income = invoices
        .filter(inv => {
          const invDate = new Date(inv.issuedDate)
          return (
            inv.status === "Paid" &&
            invDate.toDateString() === date.toDateString()
          )
        })
        .reduce((sum, inv) => sum + inv.total, 0)

      // Calculate expenses (unpaid/pending invoices) for this date
      const expenses = invoices
        .filter(inv => {
          const invDate = new Date(inv.issuedDate)
          return (
            (inv.status === "Unpaid" || inv.status === "Pending") &&
            invDate.toDateString() === date.toDateString()
          )
        })
        .reduce((sum, inv) => sum + inv.total, 0)

      data.push({
        date: dateStr,
        income: Math.round(income * 100) / 100,
        expenses: Math.round(expenses * 100) / 100,
      })
    }

    return data
  }, [invoices, timeRange])

  // Calculate totals for the selected period
  const totals = useMemo(() => {
    const totalIncome = chartData.reduce((sum, day) => sum + day.income, 0)
    const totalExpenses = chartData.reduce((sum, day) => sum + day.expenses, 0)
    const netCapital = totalIncome - totalExpenses

    return {
      income: Math.round(totalIncome * 100) / 100,
      expenses: Math.round(totalExpenses * 100) / 100,
      net: Math.round(netCapital * 100) / 100,
    }
  }, [chartData])

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 sm:p-3 border border-border rounded-lg shadow-lg">
          <p className="text-xs sm:text-sm font-semibold text-foreground mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-teal-600">
              Income: ₦{payload[0].value.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm" style={{ color: "#CDDC39" }}>
              Expenses: ₦{payload[1].value.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-foreground font-semibold border-t pt-1 mt-1">
              Net: ₦{(payload[0].value - payload[1].value).toLocaleString()}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="p-4 sm:p-6 mb-4 sm:mb-6 lg:mb-8 bg-white rounded-lg border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div className="w-full sm:w-auto">
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">Working Capital</h2>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs">
            <span className="text-teal-600 font-semibold">
              Income: ₦{totals.income.toLocaleString()}
            </span>
            <span className="font-semibold" style={{ color: "#CDDC39" }}>
              Expenses: ₦{totals.expenses.toLocaleString()}
            </span>
            <span className={`font-semibold ${totals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Net: ₦{totals.net.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <span className="text-xs sm:text-sm text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-xs sm:text-sm text-muted-foreground">Expenses</span>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="text-xs sm:text-sm px-2 sm:px-3 py-1 border border-border rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {chartData.length === 0 || (totals.income === 0 && totals.expenses === 0) ? (
        <div className="h-[250px] sm:h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center px-4">
            <p className="text-muted-foreground text-sm">No data available for the selected period</p>
            <p className="text-xs text-muted-foreground mt-2">
              Create invoices to see your working capital chart
            </p>
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              stroke="#999"
              fontSize={10}
              className="sm:text-xs"
              angle={timeRange === "90" ? -45 : 0}
              textAnchor={timeRange === "90" ? "end" : "middle"}
              height={timeRange === "90" ? 60 : 30}
            />
            <YAxis
              stroke="#999"
              fontSize={10}
              className="sm:text-xs"
              tickFormatter={(value) => `₦${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={{ fill: '#14b8a6', r: 3 }}
              activeDot={{ r: 5 }}
              name="Income"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#CDDC39"
              strokeWidth={2}
              dot={{ fill: '#CDDC39', r: 3 }}
              activeDot={{ r: 5 }}
              name="Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}