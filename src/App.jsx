import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTransactions } from './hooks/useTransactions';
import { useStorePrices } from './hooks/useStorePrices';
import { useToast } from './hooks/useToast';
import { useIsMobile } from './hooks/useIsMobile';
import { calculateSummary } from './utils/calculations';
import { colors } from './constants/colors';

// Components
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { Dashboard } from './components/Dashboard/Dashboard';
import { TransactionList } from './components/Transactions/TransactionList';
import { AddTransactionModal } from './components/Transactions/AddTransactionModal';
import { EditTransactionModal } from './components/Transactions/EditTransactionModal';
import { PriceList } from './components/PriceList/PriceList';
import { UpdatePriceModal } from './components/PriceList/UpdatePriceModal';
import { ToastContainer } from './components/common/Toast';
import { ConfirmModal } from './components/common/ConfirmModal';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);
  const [showUpdatePrice, setShowUpdatePrice] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Hooks
  const { user, loading, signUp, signIn, signInAsGuest, signOut } = useAuth();
  const { transactions, loading: transactionsLoading, addTransaction, updateTransaction, deleteTransaction } = useTransactions(user);
  const { stores, goldTypes, storePrices, loading: pricesLoading, updatePrice } = useStorePrices();
  const toast = useToast();
  const isMobile = useIsMobile();

  // Combined loading state for navigation
  const dataLoading = transactionsLoading || pricesLoading;

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: colors.bgGradient
      }}>
        <div style={{ color: 'white', fontSize: '24px', fontWeight: '600' }}>Đang tải...</div>
      </div>
    );
  }

  // Login screen
  if (!user) {
    return (
      <>
        <LoginForm onSignIn={signIn} onSignUp={signUp} onSignInAsGuest={signInAsGuest} toast={toast} />
        <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
      </>
    );
  }

  // Set view to 'prices' for guest users
  if (user.isGuest && view !== 'prices') {
    setView('prices');
  }

  // Calculate summary
  const summary = calculateSummary(transactions, storePrices);

  // Handlers
  const handleEditTransaction = (transaction) => {
    setEditTransaction(transaction);
  };

  const handleDeleteTransaction = (id) => {
    setConfirmDelete(id);
  };

  const confirmDeleteTransaction = async () => {
    try {
      await deleteTransaction(confirmDelete);
      toast.success('Xóa giao dịch thành công!');
      setConfirmDelete(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bgSolid,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    }}>
      <Header user={user} onLogout={signOut} />
      <Navigation currentView={view} onViewChange={setView} loading={dataLoading} user={user} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: isMobile ? '16px' : '32px 24px'
      }}>
        {view === 'dashboard' && <Dashboard summary={summary} transactions={transactions} />}

        {view === 'transactions' && (
          <TransactionList
            transactions={transactions}
            onDelete={handleDeleteTransaction}
            onEdit={handleEditTransaction}
            onAddClick={() => setShowAddTransaction(true)}
          />
        )}

        {view === 'prices' && (
          <PriceList
            user={user}
            storePrices={storePrices}
            onUpdateClick={() => {
              // Only allow ducanhh@gmail.com to update prices
              if (user.email === 'ducanhh@gmail.com') {
                setShowUpdatePrice(true);
              } else {
                toast.error('Bạn không có quyền cập nhật giá vàng');
              }
            }}
          />
        )}
      </div>

      {/* Modals */}
      {showAddTransaction && (
        <AddTransactionModal
          user={user}
          stores={stores}
          goldTypes={goldTypes}
          storePrices={storePrices}
          onSave={addTransaction}
          onClose={() => setShowAddTransaction(false)}
          toast={toast}
        />
      )}

      {editTransaction && (
        <EditTransactionModal
          transaction={editTransaction}
          user={user}
          stores={stores}
          goldTypes={goldTypes}
          storePrices={storePrices}
          onSave={updateTransaction}
          onClose={() => setEditTransaction(null)}
          toast={toast}
        />
      )}

      {showUpdatePrice && (
        <UpdatePriceModal
          user={user}
          stores={stores}
          goldTypes={goldTypes}
          onSave={updatePrice}
          onClose={() => setShowUpdatePrice(false)}
          toast={toast}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDelete !== null}
        title="Xóa giao dịch"
        message="Bạn có chắc chắn muốn xóa giao dịch này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
        onConfirm={confirmDeleteTransaction}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
}
