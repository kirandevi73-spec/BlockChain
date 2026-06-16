import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
interface VolumeChartProps {
  data?: any[];
}

export function VolumeChart({ data }: VolumeChartProps) {
  const chartData = data || [];
  const hasData = chartData.length > 0;

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Transaction Volume
      </h3>
      <div className="h-64 relative">
        {!hasData && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm z-10 bg-background/20 backdrop-blur-[2px]">
            No activity data in session
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hasData ? chartData : [{ date: 'None', volume: 0, flagged: 0 }]}>
            <defs>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(183, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(183, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="flaggedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(222, 30%, 18%)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
              }}
              labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="hsl(183, 100%, 50%)"
              strokeWidth={2}
              fill="url(#volumeGradient)"
              name="Total Volume"
            />
            <Area
              type="monotone"
              dataKey="flagged"
              stroke="hsl(0, 84%, 60%)"
              strokeWidth={2}
              fill="url(#flaggedGradient)"
              name="Flagged"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm text-muted-foreground">Total Volume</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive" />
          <span className="text-sm text-muted-foreground">Flagged Transactions</span>
        </div>
      </div>
    </div>
  );
}
