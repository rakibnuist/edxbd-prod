# 🌍 EduExpress International

> **Your Gateway to Global Education** - Expert study abroad consultancy with FREE scholarship assistance since 2018.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-blue?style=for-the-badge&logo=vercel)](https://eduexpressint.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/rakibnuist/edXBD)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)

## 🚀 Live Application

**🌐 Production URL:** [https://eduexpressint.com](https://eduexpressint.com)

**📊 Deployment Status:** ✅ Automatically deployed from GitHub

---

## 📋 Project Overview

EduExpress International is a comprehensive study abroad consultancy platform that connects students with global education opportunities. Built with modern web technologies, it provides expert guidance, scholarship assistance, and seamless user experience for international education seekers.

### 🎯 Key Features

- **🎓 Study Abroad Guidance** - Expert consultation for international education
- **💰 Scholarship Assistance** - FREE scholarship application support since 2018
- **🌍 Global Destinations** - Comprehensive country-wise study information
- **📞 24/7 Support** - WhatsApp integration for instant assistance
- **📊 Analytics Dashboard** - Performance tracking and lead management
- **🔐 Admin Panel** - Complete content and user management system

### 🌟 Destinations Covered

- 🇬🇧 United Kingdom
- 🇳🇱 Netherlands  
- 🇫🇮 Finland
- 🇭🇺 Hungary
- 🇬🇪 Georgia
- 🇭🇷 Croatia
- 🇨🇾 Cyprus
- 🇰🇷 South Korea
- 🇨🇳 China

---

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.5.4** - React framework with App Router
- **TypeScript 5.0** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **React Icons** - Comprehensive icon library

### Backend & Database
- **MongoDB 6.20.0** - NoSQL database
- **Mongoose 8.19.0** - MongoDB object modeling
- **JWT Authentication** - Secure user sessions
- **bcryptjs** - Password hashing

### Analytics & Tracking
- **Vercel Analytics** - Performance monitoring
- **Google Analytics** - User behavior tracking
- **Meta Pixel** - Facebook conversion tracking
- **Google Tag Manager** - Advanced tracking setup

### Deployment & Infrastructure
- **Vercel** - Serverless deployment platform
- **GitHub Actions** - CI/CD pipeline
- **Environment Variables** - Secure configuration management

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB database
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rakibnuist/edXBD.git
   cd edXBD
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   Configure your environment variables:
   - `MONGODB_URI` - MongoDB connection string
   - `JWT_SECRET` - JWT signing secret
   - `ADMIN_EMAIL` - Admin account email
   - `ADMIN_PASSWORD` - Admin account password
   - `NEXT_PUBLIC_SITE_URL` - Your domain URL

4. **Database Setup**
   ```bash
   npm run seed:admin
   ```

5. **Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
edXBD/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin dashboard
│   │   ├── api/            # API routes
│   │   ├── destinations/   # Country pages
│   │   └── ...
│   ├── components/         # Reusable React components
│   ├── lib/               # Utility functions
│   ├── models/            # MongoDB schemas
│   └── types/             # TypeScript definitions
├── public/                # Static assets
├── scripts/               # Utility scripts
└── docs/                  # Documentation
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run seed:admin` | Create admin user |

---

## 🌐 Deployment

### Automatic Deployment
This project is configured for automatic deployment:

1. **Push to GitHub** - Any push to `main` branch triggers deployment
2. **Vercel Integration** - Automatic builds and deployments
3. **Environment Variables** - Securely managed in Vercel dashboard

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

---

## 📊 Performance & Analytics

- **⚡ Core Web Vitals** - Optimized for Google's performance metrics
- **📈 Real-time Analytics** - User behavior and conversion tracking
- **🔍 SEO Optimized** - Meta tags, sitemaps, and structured data
- **📱 Mobile Responsive** - Perfect experience across all devices

---

## 🔐 Admin Features

- **👥 User Management** - Complete user administration
- **📝 Content Management** - Dynamic content updates
- **📊 Lead Tracking** - Student inquiry management
- **🤝 Partnership Management** - University and agent partnerships
- **⭐ Testimonial Management** - Success story curation
- **🌍 Country Management** - Destination information updates

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support & Contact

- **🌐 Website:** [https://eduexpressint.com](https://eduexpressint.com)
- **📧 Email:** Contact through the website
- **💬 WhatsApp:** Available on the website
- **📱 Phone:** Available on the website

---

## 📄 License

This project is proprietary software owned by EduExpress International. All rights reserved.

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing React framework
- **Vercel** - For seamless deployment platform
- **MongoDB** - For the robust database solution
- **Tailwind CSS** - For the utility-first CSS framework

---

<div align="center">

**Made with ❤️ by EduExpress International**

*Empowering students to achieve their global education dreams since 2018*

[![Live Demo](https://img.shields.io/badge/🌐_Visit_Live_Site-https://eduexpressint.com-blue?style=for-the-badge)](https://eduexpressint.com)

</div>
