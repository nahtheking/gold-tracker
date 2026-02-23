import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { colors } from '../../constants/colors';
import { formatDate } from '../../utils/calculations';

export const GoldChart = ({ transactions }) => {
  // Process transactions to get cumulative gold quantity over time
  const getChartData = () => {
    if (!transactions || transactions.length === 0) return [];

    // Sort transactions by date (oldest first)
    const sorted = [...transactions].sort((a, b) =>
      new Date(a.transaction_date) - new Date(b.transaction_date)
    );

    let cumulativeQuantity = 0;
    const data = [];

    sorted.forEach((t) => {
      // Add for buy, subtract for sell
      if (t.transaction_type === 'buy') {
        cumulativeQuantity += t.quantity;
      } else {
        cumulativeQuantity -= t.quantity;
      }

      data.push({
        date: formatDate(t.transaction_date),
        fullDate: t.transaction_date,
        quantity: parseFloat(cumulativeQuantity.toFixed(3))
      });
    });

    return data;
  };

  const chartData = getChartData();

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
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
        <div style={{ fontSize: '16px', fontWeight: '600' }}>Chưa có dữ liệu</div>
        <div style={{ fontSize: '14px', marginTop: '8px' }}>Thêm giao dịch để xem biểu đồ</div>
      </div>
    );
  }

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
        Biến động số lượng vàng
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.gray200} />
          <XAxis
            dataKey="date"
            stroke={colors.gray400}
            style={{ fontSize: '12px' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke={colors.gray400}
            style={{ fontSize: '12px' }}
            label={{
              value: 'Số lượng (chỉ)',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: '12px', fill: colors.gray500 }
            }}
          />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: `1px solid ${colors.gray200}`,
              borderRadius: '8px',
              boxShadow: colors.shadowDefault
            }}
            formatter={(value) => [`${value} chỉ`, 'Tổng vàng']}
            labelStyle={{ fontWeight: '600', color: colors.gray700 }}
          />
          <Line
            type="monotone"
            dataKey="quantity"
            stroke={colors.primaryText}
            strokeWidth={3}
            dot={{ fill: colors.primary, r: 4 }}
            activeDot={{ r: 6, fill: colors.primaryDark }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        background: colors.gray50,
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px'
      }}>
        <span style={{ color: colors.gray600 }}>
          Số giao dịch: <strong style={{ color: colors.gray700 }}>{transactions.length}</strong>
        </span>
        <span style={{ color: colors.gray600 }}>
          Tổng hiện tại: <strong style={{ color: colors.primaryText }}>
            {chartData[chartData.length - 1].quantity} chỉ
          </strong>
        </span>
      </div>
    </div>
  );
};
