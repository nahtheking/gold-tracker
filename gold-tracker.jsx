import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = 'https://ulefqewsjvararvsbrow.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZWZxZXdzanZhcmFydnNicm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MDc2OTEsImV4cCI6MjA4NzM4MzY5MX0.docgTfCLkrRoZk551x-suON_Pkv9-j-IF9n-aqf-BaY';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function GoldTracker() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard'); // dashboard, transactions, stores, prices
  const [transactions, setTransactions] = useState([]);
  const [stores, setStores] = useState([]);
  const [goldTypes, setGoldTypes] = useState([]);
  const [storePrices, setStorePrices] = useState([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showUpdatePrice, setShowUpdatePrice] = useState(false);

  // Auth states
  const [authMode, setAuthMode] = useState('login'); // login or signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Transaction form states
  const [transactionForm, setTransactionForm] = useState({
    type: 'buy',
    storeId: '',
    goldTypeId: '',
    quantity: '',
    pricePerUnit: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Price update form
  const [priceForm, setPriceForm] = useState({
    storeId: '',
    goldTypeId: '',
    buyPrice: '',
    sellPrice: ''
  });

  useEffect(() => {
    checkUser();
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  };

  const loadData = async () => {
    const [transRes, storesRes, typesRes, pricesRes] = await Promise.all([
      supabase.from('transactions').select('*, stores(name), gold_types(name, unit)').eq('user_id', user.id).order('transaction_date', { ascending: false }),
      supabase.from('stores').select('*'),
      supabase.from('gold_types').select('*'),
      supabase.from('store_prices').select('*, stores(name), gold_types(name, unit)')
    ]);

    setTransactions(transRes.data || []);
    setStores(storesRes.data || []);
    setGoldTypes(typesRes.data || []);
    setStorePrices(pricesRes.data || []);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    try {
      const totalAmount = parseFloat(transactionForm.quantity) * parseFloat(transactionForm.pricePerUnit);
      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        store_id: transactionForm.storeId || null,
        gold_type_id: transactionForm.goldTypeId,
        transaction_type: transactionForm.type,
        quantity: parseFloat(transactionForm.quantity),
        price_per_unit: parseFloat(transactionForm.pricePerUnit),
        total_amount: totalAmount,
        transaction_date: new Date(transactionForm.date).toISOString(),
        notes: transactionForm.notes
      });

      if (error) throw error;
      
      setShowAddTransaction(false);
      setTransactionForm({
        type: 'buy',
        storeId: '',
        goldTypeId: '',
        quantity: '',
        pricePerUnit: '',
        notes: '',
        date: new Date().toISOString().split('T')[0]
      });
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('store_prices').upsert({
        store_id: priceForm.storeId,
        gold_type_id: priceForm.goldTypeId,
        buy_price: parseFloat(priceForm.buyPrice),
        sell_price: parseFloat(priceForm.sellPrice),
        updated_by: user.id
      }, { onConflict: 'store_id,gold_type_id' });

      if (error) throw error;
      
      setShowUpdatePrice(false);
      setPriceForm({ storeId: '', goldTypeId: '', buyPrice: '', sellPrice: '' });
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa giao dịch này?')) return;
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      loadData();
    } catch (error) {
      alert(error.message);
    }
  };

  const calculateSummary = () => {
    let totalBuyAmount = 0;
    let totalSellAmount = 0;
    const holdings = {};

    transactions.forEach(t => {
      const key = t.gold_type_id;
      if (!holdings[key]) {
        holdings[key] = {
          name: t.gold_types?.name || 'Unknown',
          unit: t.gold_types?.unit || 'chỉ',
          quantity: 0,
          investedAmount: 0
        };
      }

      if (t.transaction_type === 'buy') {
        holdings[key].quantity += t.quantity;
        holdings[key].investedAmount += t.total_amount;
        totalBuyAmount += t.total_amount;
      } else {
        holdings[key].quantity -= t.quantity;
        holdings[key].investedAmount -= t.total_amount;
        totalSellAmount += t.total_amount;
      }
    });

    // Calculate current value based on latest store prices
    let totalCurrentValue = 0;
    Object.keys(holdings).forEach(key => {
      if (holdings[key].quantity > 0) {
        const latestPrice = storePrices.find(p => p.gold_type_id === key);
        if (latestPrice) {
          totalCurrentValue += holdings[key].quantity * latestPrice.sell_price;
        }
      }
    });

    const netInvestment = totalBuyAmount - totalSellAmount;
    const profitLoss = totalCurrentValue - netInvestment;
    const profitLossPercent = netInvestment > 0 ? (profitLoss / netInvestment) * 100 : 0;

    return {
      holdings: Object.values(holdings).filter(h => h.quantity > 0),
      totalInvestment: netInvestment,
      currentValue: totalCurrentValue,
      profitLoss,
      profitLossPercent
    };
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5C842 0%, #E6B730 100%)'
      }}>
        <div style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>Đang tải...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5C842 0%, #E6B730 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '48px',
          maxWidth: '440px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a202c', margin: '0 0 8px 0' }}>
              Quản Lý Vàng
            </h1>
            <p style={{ color: '#718096', fontSize: '15px', margin: 0 }}>
              Theo dõi đầu tư vàng của bạn
            </p>
          </div>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#F5C842'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#F5C842'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                background: 'linear-gradient(135deg, #F5C842 0%, #E6B730 100%)',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                marginTop: '8px',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 24px rgba(245, 200, 66, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <button
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#F5C842',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {authMode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const summary = calculateSummary();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #f7fafc 0%, #edf2f7 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #F5C842 0%, #E6B730 100%)',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '32px' }}>💰</div>
            <h1 style={{ color: 'white', fontSize: '24px', fontWeight: '700', margin: 0 }}>
              Quản Lý Vàng
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)'
              }}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          gap: '8px'
        }}>
          {['dashboard', 'transactions', 'prices'].map(tab => (
            <button
              key={tab}
              onClick={() => setView(tab)}
              style={{
                padding: '16px 24px',
                background: 'none',
                border: 'none',
                borderBottom: view === tab ? '3px solid #F5C842' : '3px solid transparent',
                color: view === tab ? '#D4A429' : '#718096',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {tab === 'dashboard' && '📊 Tổng quan'}
              {tab === 'transactions' && '📝 Giao dịch'}
              {tab === 'prices' && '💵 Giá vàng'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div>
            {/* Summary Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              marginBottom: '32px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '14px', color: '#718096', fontWeight: '600', marginBottom: '8px' }}>
                  TỔNG VỐN ĐẦU TƯ
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#2d3748' }}>
                  {summary.totalInvestment.toLocaleString('vi-VN')} ₫
                </div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '14px', color: '#718096', fontWeight: '600', marginBottom: '8px' }}>
                  GIÁ TRỊ HIỆN TẠI
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: '#2d3748' }}>
                  {summary.currentValue.toLocaleString('vi-VN')} ₫
                </div>
              </div>

              <div style={{
                background: summary.profitLoss >= 0 
                  ? 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)'
                  : 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '600', marginBottom: '8px' }}>
                  LÃI/LỖ
                </div>
                <div style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>
                  {summary.profitLoss >= 0 ? '+' : ''}{summary.profitLoss.toLocaleString('vi-VN')} ₫
                </div>
                <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', marginTop: '4px' }}>
                  {summary.profitLoss >= 0 ? '+' : ''}{summary.profitLossPercent.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Holdings */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#2d3748', marginBottom: '20px' }}>
                Tài sản vàng hiện có
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {summary.holdings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#a0aec0' }}>
                    Chưa có vàng nào. Thêm giao dịch để bắt đầu!
                  </div>
                ) : (
                  summary.holdings.map((holding, idx) => (
                    <div key={idx} style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: '#f7fafc',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#2d3748', fontSize: '16px' }}>
                          {holding.name}
                        </div>
                        <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
                          Vốn: {holding.investedAmount.toLocaleString('vi-VN')} ₫
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: '700', color: '#D4A429' }}>
                          {holding.quantity.toFixed(2)} {holding.unit}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Transactions View */}
        {view === 'transactions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
                Lịch sử giao dịch
              </h2>
              <button
                onClick={() => setShowAddTransaction(true)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #F5C842 0%, #E6B730 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(245, 200, 66, 0.3)'
                }}
              >
                + Thêm giao dịch
              </button>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              {transactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a0aec0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>Chưa có giao dịch nào</div>
                  <div style={{ fontSize: '14px', marginTop: '8px' }}>Nhấn "Thêm giao dịch" để bắt đầu</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>NGÀY</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>LOẠI</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>CỬA HÀNG</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>VÀNG</th>
                        <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>SỐ LƯỢNG</th>
                        <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>GIÁ/ĐƠN VỊ</th>
                        <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>TỔNG TIỀN</th>
                        <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>THAO TÁC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#4a5568' }}>
                            {new Date(t.transaction_date).toLocaleDateString('vi-VN')}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '600',
                              background: t.transaction_type === 'buy' ? '#c6f6d5' : '#fed7d7',
                              color: t.transaction_type === 'buy' ? '#22543d' : '#742a2a'
                            }}>
                              {t.transaction_type === 'buy' ? 'Mua' : 'Bán'}
                            </span>
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#4a5568' }}>
                            {t.stores?.name || '-'}
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#2d3748', fontWeight: '600' }}>
                            {t.gold_types?.name || '-'}
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#4a5568', textAlign: 'right' }}>
                            {t.quantity} {t.gold_types?.unit}
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#4a5568', textAlign: 'right' }}>
                            {t.price_per_unit.toLocaleString('vi-VN')} ₫
                          </td>
                          <td style={{ padding: '16px', fontSize: '15px', color: '#2d3748', fontWeight: '700', textAlign: 'right' }}>
                            {t.total_amount.toLocaleString('vi-VN')} ₫
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <button
                              onClick={() => handleDeleteTransaction(t.id)}
                              style={{
                                padding: '6px 12px',
                                background: '#fed7d7',
                                border: 'none',
                                borderRadius: '6px',
                                color: '#742a2a',
                                fontSize: '13px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Prices View */}
        {view === 'prices' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', margin: 0 }}>
                Bảng giá vàng
              </h2>
              <button
                onClick={() => setShowUpdatePrice(true)}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #F5C842 0%, #E6B730 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(245, 200, 66, 0.3)'
                }}
              >
                + Cập nhật giá
              </button>
            </div>

            <div style={{
              background: 'white',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              {storePrices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#a0aec0' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>💵</div>
                  <div style={{ fontSize: '18px', fontWeight: '600' }}>Chưa có giá vàng nào</div>
                  <div style={{ fontSize: '14px', marginTop: '8px' }}>Nhấn "Cập nhật giá" để thêm</div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>CỬA HÀNG</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>LOẠI VÀNG</th>
                        <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>GIÁ MUA</th>
                        <th style={{ padding: '16px', textAlign: 'right', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>GIÁ BÁN</th>
                        <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '700', color: '#4a5568' }}>CẬP NHẬT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {storePrices.map((p) => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#2d3748', fontWeight: '600' }}>
                            {p.stores?.name || '-'}
                          </td>
                          <td style={{ padding: '16px', fontSize: '14px', color: '#4a5568' }}>
                            {p.gold_types?.name || '-'}
                          </td>
                          <td style={{ padding: '16px', fontSize: '15px', color: '#48bb78', fontWeight: '700', textAlign: 'right' }}>
                            {p.buy_price.toLocaleString('vi-VN')} ₫
                          </td>
                          <td style={{ padding: '16px', fontSize: '15px', color: '#f56565', fontWeight: '700', textAlign: 'right' }}>
                            {p.sell_price.toLocaleString('vi-VN')} ₫
                          </td>
                          <td style={{ padding: '16px', fontSize: '13px', color: '#718096' }}>
                            {new Date(p.updated_at).toLocaleString('vi-VN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', marginBottom: '24px' }}>
              Thêm giao dịch mới
            </h3>

            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Loại giao dịch
                </label>
                <select
                  value={transactionForm.type}
                  onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                >
                  <option value="buy">Mua vào</option>
                  <option value="sell">Bán ra</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Loại vàng *
                </label>
                <select
                  value={transactionForm.goldTypeId}
                  onChange={(e) => setTransactionForm({ ...transactionForm, goldTypeId: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                >
                  <option value="">-- Chọn loại vàng --</option>
                  {goldTypes.map(gt => (
                    <option key={gt.id} value={gt.id}>{gt.name} ({gt.purity})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Cửa hàng
                </label>
                <select
                  value={transactionForm.storeId}
                  onChange={(e) => setTransactionForm({ ...transactionForm, storeId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                >
                  <option value="">-- Chọn cửa hàng (tùy chọn) --</option>
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Số lượng *
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={transactionForm.quantity}
                  onChange={(e) => setTransactionForm({ ...transactionForm, quantity: e.target.value })}
                  required
                  placeholder="Ví dụ: 5.5"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Giá mỗi đơn vị (VND) *
                </label>
                <input
                  type="number"
                  step="1000"
                  value={transactionForm.pricePerUnit}
                  onChange={(e) => setTransactionForm({ ...transactionForm, pricePerUnit: e.target.value })}
                  required
                  placeholder="Ví dụ: 18110000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Ngày giao dịch *
                </label>
                <input
                  type="date"
                  value={transactionForm.date}
                  onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Ghi chú
                </label>
                <textarea
                  value={transactionForm.notes}
                  onChange={(e) => setTransactionForm({ ...transactionForm, notes: e.target.value })}
                  rows="3"
                  placeholder="Ghi chú thêm..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              {transactionForm.quantity && transactionForm.pricePerUnit && (
                <div style={{
                  padding: '16px',
                  background: '#f7fafc',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>Tổng tiền:</span>
                  <span style={{ fontSize: '20px', fontWeight: '700', color: '#D4A429' }}>
                    {(parseFloat(transactionForm.quantity) * parseFloat(transactionForm.pricePerUnit)).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddTransaction(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#4a5568',
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #F5C842 0%, #E6B730 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Lưu giao dịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Price Modal */}
      {showUpdatePrice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', marginBottom: '24px' }}>
              Cập nhật giá vàng
            </h3>

            <form onSubmit={handleUpdatePrice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Cửa hàng *
                </label>
                <select
                  value={priceForm.storeId}
                  onChange={(e) => setPriceForm({ ...priceForm, storeId: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                >
                  <option value="">-- Chọn cửa hàng --</option>
                  {stores.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Loại vàng *
                </label>
                <select
                  value={priceForm.goldTypeId}
                  onChange={(e) => setPriceForm({ ...priceForm, goldTypeId: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                >
                  <option value="">-- Chọn loại vàng --</option>
                  {goldTypes.map(gt => (
                    <option key={gt.id} value={gt.id}>{gt.name} ({gt.purity})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Giá mua (VND) *
                </label>
                <input
                  type="number"
                  step="1000"
                  value={priceForm.buyPrice}
                  onChange={(e) => setPriceForm({ ...priceForm, buyPrice: e.target.value })}
                  required
                  placeholder="Ví dụ: 18110000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px' }}>
                  Giá bán (VND) *
                </label>
                <input
                  type="number"
                  step="1000"
                  value={priceForm.sellPrice}
                  onChange={(e) => setPriceForm({ ...priceForm, sellPrice: e.target.value })}
                  required
                  placeholder="Ví dụ: 18410000"
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowUpdatePrice(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#e2e8f0',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#4a5568',
                    cursor: 'pointer'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #F5C842 0%, #E6B730 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  Cập nhật giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
