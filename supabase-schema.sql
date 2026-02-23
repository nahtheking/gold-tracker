-- Gold Investment Tracker Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (automatically created by Supabase Auth)
-- We'll use auth.users table

-- Stores/Shops table
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Gold types table
CREATE TABLE gold_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- e.g., "Nhẫn 24K", "Vàng miếng SJC", "Nhẫn 18K"
    purity VARCHAR(50), -- e.g., "24K", "18K", "999.9"
    unit VARCHAR(20) DEFAULT 'chỉ', -- chỉ, gram, lượng
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Store prices table (current gold prices at each store)
CREATE TABLE store_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    gold_type_id UUID REFERENCES gold_types(id) ON DELETE CASCADE,
    buy_price DECIMAL(15, 0) NOT NULL, -- Giá mua vào (VND)
    sell_price DECIMAL(15, 0) NOT NULL, -- Giá bán ra (VND)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    UNIQUE(store_id, gold_type_id)
);

-- Transactions table (buy/sell history)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    gold_type_id UUID REFERENCES gold_types(id) ON DELETE SET NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
    quantity DECIMAL(10, 3) NOT NULL, -- Số lượng (chỉ/gram)
    price_per_unit DECIMAL(15, 0) NOT NULL, -- Giá mỗi đơn vị (VND)
    total_amount DECIMAL(15, 0) NOT NULL, -- Tổng tiền giao dịch
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Family sharing table (optional - for sharing data between family members)
CREATE TABLE family_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_group_id UUID REFERENCES family_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(family_group_id, user_id)
);

-- Indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);
CREATE INDEX idx_store_prices_store ON store_prices(store_id);
CREATE INDEX idx_store_prices_gold_type ON store_prices(gold_type_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE gold_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Stores policies (anyone can read, only authenticated users can create)
CREATE POLICY "Stores are viewable by everyone"
    ON stores FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create stores"
    ON stores FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own stores"
    ON stores FOR UPDATE
    USING (created_by = auth.uid());

-- Gold types policies (read-only for most users)
CREATE POLICY "Gold types are viewable by everyone"
    ON gold_types FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can create gold types"
    ON gold_types FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Store prices policies
CREATE POLICY "Store prices are viewable by everyone"
    ON store_prices FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage store prices"
    ON store_prices FOR ALL
    USING (auth.uid() IS NOT NULL);

-- Transactions policies (users can only see their own or family group's transactions)
CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own transactions"
    ON transactions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own transactions"
    ON transactions FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own transactions"
    ON transactions FOR DELETE
    USING (user_id = auth.uid());

-- Family groups policies
CREATE POLICY "Users can view their family groups"
    ON family_groups FOR SELECT
    USING (
        id IN (
            SELECT family_group_id FROM family_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create family groups"
    ON family_groups FOR INSERT
    WITH CHECK (created_by = auth.uid());

-- Family members policies
CREATE POLICY "Users can view family members in their groups"
    ON family_members FOR SELECT
    USING (
        family_group_id IN (
            SELECT family_group_id FROM family_members WHERE user_id = auth.uid()
        )
    );

-- Insert some default gold types
INSERT INTO gold_types (name, purity, unit) VALUES
    ('Nhẫn tròn 24K', '24K', 'chỉ'),
    ('Nhẫn tròn 18K', '18K', 'chỉ'),
    ('Vàng miếng SJC', '999.9', 'chỉ'),
    ('Vàng miếng PNJ', '999.9', 'chỉ'),
    ('Vàng nữ trang 18K', '18K', 'chỉ'),
    ('Vàng nữ trang 14K', '14K', 'chỉ');

-- Insert some default stores (popular Vietnam gold stores)
INSERT INTO stores (name, location) VALUES
    ('SJC', 'Hồ Chí Minh'),
    ('PNJ', 'Hồ Chí Minh'),
    ('Doji', 'Hà Nội'),
    ('Bảo Tín Minh Châu', 'Hồ Chí Minh'),
    ('Kim Bé', 'Hồ Chí Minh');

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_store_prices_updated_at BEFORE UPDATE ON store_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
