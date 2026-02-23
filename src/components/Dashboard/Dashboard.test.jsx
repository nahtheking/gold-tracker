import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from './Dashboard';

describe('Dashboard Component', () => {
  it('should render summary cards', () => {
    const mockSummary = {
      totalInvestment: 100000000,
      currentValue: 105000000,
      profitLoss: 5000000,
      profitLossPercent: 5,
      holdings: []
    };

    render(<Dashboard summary={mockSummary} />);

    // Check if summary cards are displayed
    expect(screen.getByText('TỔNG VỐN ĐẦU TƯ')).toBeInTheDocument();
    expect(screen.getByText('GIÁ TRỊ HIỆN TẠI')).toBeInTheDocument();
    expect(screen.getByText('LÃI/LỖ')).toBeInTheDocument();

    // Check if values are formatted correctly
    expect(screen.getByText('100.000.000 ₫')).toBeInTheDocument();
    expect(screen.getByText('105.000.000 ₫')).toBeInTheDocument();
    expect(screen.getByText('+5.000.000 ₫')).toBeInTheDocument();
    expect(screen.getByText('+5.00%')).toBeInTheDocument();
  });

  it('should show empty state when no holdings', () => {
    const mockSummary = {
      totalInvestment: 0,
      currentValue: 0,
      profitLoss: 0,
      profitLossPercent: 0,
      holdings: []
    };

    render(<Dashboard summary={mockSummary} />);

    expect(screen.getByText('Chưa có vàng nào. Thêm giao dịch để bắt đầu!')).toBeInTheDocument();
  });

  it('should display holdings correctly', () => {
    const mockSummary = {
      totalInvestment: 90000000,
      currentValue: 92500000,
      profitLoss: 2500000,
      profitLossPercent: 2.78,
      holdings: [
        {
          name: 'Vàng SJC',
          unit: 'chỉ',
          quantity: 5,
          investedAmount: 90000000
        }
      ]
    };

    render(<Dashboard summary={mockSummary} />);

    // Check if holding is displayed
    expect(screen.getByText('Vàng SJC')).toBeInTheDocument();
    expect(screen.getByText('5.00 chỉ')).toBeInTheDocument();
    expect(screen.getByText(/Vốn: 90.000.000 ₫/)).toBeInTheDocument();
  });

  it('should display multiple holdings', () => {
    const mockSummary = {
      totalInvestment: 150000000,
      currentValue: 155000000,
      profitLoss: 5000000,
      profitLossPercent: 3.33,
      holdings: [
        {
          name: 'Vàng SJC',
          unit: 'chỉ',
          quantity: 5,
          investedAmount: 90000000
        },
        {
          name: 'Vàng 24K',
          unit: 'gram',
          quantity: 10.5,
          investedAmount: 60000000
        }
      ]
    };

    render(<Dashboard summary={mockSummary} />);

    expect(screen.getByText('Vàng SJC')).toBeInTheDocument();
    expect(screen.getByText('Vàng 24K')).toBeInTheDocument();
    expect(screen.getByText('5.00 chỉ')).toBeInTheDocument();
    expect(screen.getByText('10.50 gram')).toBeInTheDocument();
  });

  it('should show negative profit/loss with correct styling', () => {
    const mockSummary = {
      totalInvestment: 100000000,
      currentValue: 95000000,
      profitLoss: -5000000,
      profitLossPercent: -5,
      holdings: []
    };

    render(<Dashboard summary={mockSummary} />);

    expect(screen.getByText('-5.000.000 ₫')).toBeInTheDocument();
    expect(screen.getByText('-5.00%')).toBeInTheDocument();
  });
});
