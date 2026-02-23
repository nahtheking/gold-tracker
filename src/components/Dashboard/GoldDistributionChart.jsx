import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { colors } from '../../constants/colors';

export const GoldDistributionChart = ({ transactions }) => {
  // Calculate gold quantity by store
  const getChartData = () => {
    if (!transactions || transactions.length === 0) return [];

    const storeData = {};

    transactions.forEach((t) => {
      const storeName = t.stores?.name || 'Không rõ';

      if (!storeData[storeName]) {
        storeData[storeName] = 0;
      }

      // Add for buy, subtract for sell
      if (t.transaction_type === 'buy') {
        storeData[storeName] += t.quantity;
      } else {
        storeData[storeName] -= t.quantity;
      }
    });

    // Convert to array and filter out zero/negative quantities
    return Object.entries(storeData)
      .filter(([_, quantity]) => quantity > 0)
      .map(([name, quantity]) => ({
        name,
        value: parseFloat(quantity.toFixed(3))
      }))
      .sort((a, b) => b.value - a.value); // Sort by quantity descending
  };

  const chartData = getChartData();

  // Color palette for pie slices - distinct colors
  const COLORS = [
    '#F59E0B',  // Amber/Orange
    '#10B981',  // Green
    '#3B82F6',  // Blue
    '#EF4444',  // Red
    '#8B5CF6',  // Purple
    '#EC4899',  // Pink
    '#14B8A6',  // Teal
    '#F97316',  // Orange
    '#6366F1',  // Indigo
    '#06B6D4',  // Cyan
    '#F43F5E',  // Rose
    '#84CC16',  // Lime
  ];

  if (chartData.length === 0) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: colors.shadowDefault,
        textAlign: 'center',
        color: colors.gray400
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
        <div style={{ fontSize: '16px', fontWeight: '600' }}>Chưa có dữ liệu</div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>Thêm giao dịch để xem phân bố</div>
      </div>
    );
  }

  // Custom label for pie slices
  const renderLabel = (entry) => {
    return `${entry.value} chỉ`;
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '24px',
      boxShadow: colors.shadowDefault
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '700',
        color: colors.gray700,
        marginBottom: '20px'
      }}>
        Phân bố vàng theo cửa hàng
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value} chỉ`}
            contentStyle={{
              background: 'white',
              border: `1px solid ${colors.gray200}`,
              borderRadius: '8px',
              boxShadow: colors.shadowDefault
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => `${value}: ${entry.payload.value} chỉ`}
          />
        </PieChart>
      </ResponsiveContainer>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: colors.gray50,
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {chartData.map((item, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: COLORS[index % COLORS.length]
              }} />
              <span style={{ color: colors.gray600 }}>{item.name}</span>
            </div>
            <span style={{ fontWeight: '700', color: colors.gray700 }}>
              {item.value} chỉ ({((item.value / chartData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
