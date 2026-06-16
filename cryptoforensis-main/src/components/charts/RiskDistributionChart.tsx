import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
interface RiskDistributionProps {
  data?: any[];
}

export function RiskDistributionChart({ data }: RiskDistributionProps) {
  const chartData = data || [
    { name: 'Low', value: 0, color: 'hsl(142, 76%, 45%)' },
    { name: 'Medium', value: 0, color: 'hsl(38, 92%, 50%)' },
    { name: 'High', value: 0, color: 'hsl(25, 95%, 53%)' },
    { name: 'Critical', value: 0, color: 'hsl(0, 84%, 60%)' },
  ];
  const hasData = data && data.length > 0 && data.some(d => d.value > 0);
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Risk Distribution
      </h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Wallets']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {chartData.map((item: any) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-muted-foreground">{item.name}</span>
            <span className="text-sm font-medium text-foreground ml-auto">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
