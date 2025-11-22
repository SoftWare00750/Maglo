"use client"

import { Card } from "../ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { date: "Apr 14", income: 4000, expenses: 2400 },
  { date: "Apr 15", income: 3000, expenses: 1398 },
  { date: "Apr 16", income: 2000, expenses: 9800 },
  { date: "Apr 17", income: 2780, expenses: 3908 },
  { date: "Apr 18", income: 1890, expenses: 4800 },
  { date: "Apr 19", income: 2390, expenses: 3800 },
  { date: "Apr 20", income: 2490, expenses: 4300 },
]

export default function WorkingCapitalChart() {
  return (
    <Card className="p-6 mb-8 bg-white rounded-lg border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Working Capital</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Income</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
          <select className="text-sm px-3 py-1 border border-border rounded-lg">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" stroke="#999" />
          <YAxis stroke="#999" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#14b8a6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="expenses" stroke="#CDDC39" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
