# 💰 Gold Investment Tracker

A modern web application for tracking gold investments with real-time profit/loss calculations.

## ✨ Features

- 📊 **Dashboard**: View total investment, current value, and profit/loss
- 📝 **Transaction Management**: Track buy/sell transactions
- 💵 **Price Updates**: Update current gold prices from different stores
- 👥 **Multi-user Support**: Share with family members
- 🎨 **Modern UI**: Clean, responsive interface with gradient design

## 🛠️ Tech Stack

- **Frontend**: React 18 with Vite
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Inline CSS with modern design

## 📦 Project Structure

```
gold-tracker/
├── index.html              # HTML entry point
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── supabase-schema.sql     # Database schema
├── gold-tracker.jsx        # Main React component
├── src/
│   └── main.jsx           # React entry point
├── HUONG-DAN.md           # Vietnamese setup guide
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Setup Supabase

1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Run SQL schema from `supabase-schema.sql`
4. Get API URL and anon key from Settings → API

### 2. Configure App

Edit `gold-tracker.jsx` lines 6-7:

```javascript
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
```

### 3. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## 📊 Database Schema

### Main Tables

- **stores**: Gold shops/dealers
- **gold_types**: Types of gold (24K, 18K, SJC bars, etc.)
- **transactions**: Buy/sell history
- **store_prices**: Current gold prices at each store
- **family_groups**: Family sharing (optional)

### Security

- Row Level Security (RLS) enabled
- Users can only access their own transactions
- Family groups for data sharing

## 🎨 UI Design

Modern gradient-based design with:
- Purple/blue gradients for primary elements
- Clean card-based layouts
- Responsive grid system
- Smooth transitions and hover effects

## 📱 Usage

### Add Transaction

1. Go to "Giao dịch" tab
2. Click "+ Thêm giao dịch"
3. Fill in details (type, gold type, quantity, price, date)
4. Click "Lưu giao dịch"

### Update Prices

1. Go to "Giá vàng" tab
2. Click "+ Cập nhật giá"
3. Select store and gold type
4. Enter buy/sell prices
5. Click "Cập nhật giá"

### View Summary

Dashboard shows:
- Total investment amount
- Current value based on latest prices
- Profit/Loss (amount and percentage)
- Holdings breakdown by gold type

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload 'dist' folder to Netlify
```

## 🔒 Security Notes

- Never commit API keys to git
- Use environment variables for production
- Enable email confirmation in Supabase Auth
- Keep Supabase RLS policies updated

## 📈 Supabase Free Tier Limits

- Database: 500MB
- Storage: 1GB  
- Monthly Active Users: Unlimited
- API requests: Unlimited

Perfect for personal/family use!

## 🔮 Future Enhancements

- [ ] Excel export
- [ ] Charts and analytics
- [ ] Price change notifications
- [ ] Dark mode
- [ ] Mobile app (React Native)
- [ ] Automatic price fetching from gold websites

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

## 📞 Support

For issues or questions:
- Check the Vietnamese guide: `HUONG-DAN.md`
- Review Supabase documentation
- Check browser console for errors

---

**Made with ❤️ for gold investors**
