# Quick Start Guide - PO Management System Frontend

> Get up and running in 5 minutes! 🚀

## ⚡ Prerequisites Check

Before starting, verify you have:

```bash
# Check Node.js installation
node -v   # Should show v14 or higher

# Check npm installation
npm -v    # Should show version number

# Check backend is running
curl http://localhost:8080/api/purchase-orders  # Should return JSON
```

## 🚀 Installation (2 minutes)

### Step 1: Navigate to Project

```bash
cd /path/to/front-end
```

### Step 2: Install Dependencies

```bash
npm install
```

⏱️ Takes 2-5 minutes depending on internet

### Step 3: Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env if needed (usually defaults work)
# REACT_APP_API_URL=http://localhost:8080/api
```

## ✅ Run Development Server (30 seconds)

```bash
npm start
```

✨ Wait for browser to open at `http://localhost:3000`

## 📊 You Should See

- Dashboard with metrics
- Navigation sidebar
- Recent orders table
- Charts and analytics

## 🎯 First Actions

1. **Visit Dashboard** (auto-loaded)
   - View metrics
   - See charts
   - Click on orders for details

2. **Explore Orders**
   - Click "Purchase Orders" in sidebar
   - Filter by date range
   - Export to Excel

3. **Import Data**
   - Click "Data Import" in sidebar
   - Upload PDF file
   - Check import history

## 🔧 Common Issues & Quick Fixes

### Issue: "npm: command not found"
```bash
# Install Node.js from https://nodejs.org/
# Then restart terminal and try again
```

### Issue: "Port 3000 already in use"
```bash
# Use a different port
PORT=3001 npm start
```

### Issue: "Cannot fetch from backend"
```bash
# Check backend is running
curl http://localhost:8080/api/purchase-orders

# If not, start backend server first
```

### Issue: "Blank page or cannot see data"
```bash
# Check browser console (F12 → Console)
# Check .env file API URL
# Clear browser cache (Ctrl+Shift+Delete)
# Restart (Ctrl+C, then npm start)
```

## 📁 Project Structure at a Glance

```
src/
├── pages/        # Dashboard, Orders, Import pages
├── components/   # Charts, Tables, Filters
├── services/     # API calls (ApiService.js)
└── styles/       # CSS files
```

## 🔌 API Endpoints Connected

| Action | Endpoint | Status |
|--------|----------|--------|
| Get Orders | `/purchase-orders` | ✅ |
| Update Status | `/purchase-orders/{id}/status` | ✅ |
| Upload PDF | `/import/pdf` | ✅ |
| Export Excel | `/export/excel` | ✅ |

## 📝 Key Files

| File | Purpose |
|------|---------|
| `src/App.js` | Main app & routing |
| `src/services/ApiService.js` | All API calls |
| `src/pages/Dashboard.js` | Dashboard page |
| `.env` | Configuration |
| `package.json` | Dependencies |

## 📱 Features Quick Overview

| Feature | Location |
|---------|----------|
| Metrics & Charts | Dashboard |
| Order Management | Purchase Orders |
| Data Upload | Data Import |
| Export Data | Orders page (button) |
| View Details | Click View button |

## 🚀 Next Steps

### Immediate
1. Explore all pages
2. Try uploading test PDF
3. Filter orders
4. Check charts

### Before Deployment
1. Update `.env` for production API
2. Run `npm run build`
3. Test production build locally
4. Deploy to hosting (Netlify, Vercel, etc.)

### For Development
1. Read [FEATURES.md](FEATURES.md) for detailed features
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) for code structure
3. Read [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup

## 📚 Documentation

- **README.md** - Overview and installation
- **SETUP_GUIDE.md** - Detailed setup & deployment
- **FEATURES.md** - Feature documentation
- **ARCHITECTURE.md** - Code architecture & design
- **../docs/api_docs.md** - Backend API documentation

## 🆘 Need Help?

1. **Check browser console** (F12 → Console tab)
2. **Check Network tab** (F12 → Network tab)
3. **Verify backend is running** (curl command above)
4. **Review documentation** files
5. **Check .env configuration**

## ⚡ Development Tips

### Auto-reload on save
Changes save automatically during development. The browser will refresh.

### Debug in browser
```bash
# Open browser DevTools
Press F12

# Go to Console tab
See error messages and logs

# Go to Network tab
See API requests
```

### Clear cache if issues
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Rebuild clean
```bash
rm -rf node_modules
npm install
npm start
```

## 🎯 What Can You Do?

✅ View all purchase orders  
✅ Filter by date, supplier, status  
✅ Update order status  
✅ View order details  
✅ Export orders to Excel  
✅ Upload PDF for import  
✅ View import history  
✅ See analytics & charts  
✅ Track delivery performance  

## 😊 You're All Set!

Your Purchase Order Management System is ready to use!

**Happy coding!** 🎉

---

## Keyboard Shortcuts Cheat Sheet

| Action | Keys |
|--------|------|
| Open DevTools | F12 |
| Stop server | Ctrl + C |
| Refresh browser | F5 |
| Hard refresh | Ctrl + Shift + R |

---

**Need more details?** → See [SETUP_GUIDE.md](SETUP_GUIDE.md)

**Want feature details?** → See [FEATURES.md](FEATURES.md)

**Curious about architecture?** → See [ARCHITECTURE.md](ARCHITECTURE.md)

---

**Version**: 1.0.0  
**Last Updated**: April 2024
