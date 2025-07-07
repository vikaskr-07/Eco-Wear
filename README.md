# EcoWear - Clothing Carbon Footprint Tracker

A modern web application that helps users track the carbon footprint of their clothing items through image recognition and earn eco-rewards for sustainable choices.

## 🌱 Features

### Core Functionality

- **Image Upload & Camera Capture**: Upload photos or capture images directly from your camera
- **AI-Powered Clothing Recognition**: Mock AI system identifies clothing items in uploaded images
- **Carbon Footprint Analysis**: Calculates environmental impact for each detected clothing item
- **Eco-Rewards System**: Earn points based on analysis and low-carbon choices
- **Rewards Marketplace**: Redeem points for sustainable products and discounts

### User Experience

- **Clean, Modern Interface**: Eco-friendly design with intuitive navigation
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant feedback and live point tracking
- **Level Progression**: Bronze → Silver → Gold → Platinum user levels

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ecowear-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🏗️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **Vite** for build tooling and dev server
- **TailwindCSS 3** for styling
- **Radix UI** for accessible components
- **React Router 6** for navigation
- **React Webcam** for camera functionality

### Backend

- **Express.js** with TypeScript
- **CORS** enabled for cross-origin requests
- **Zod** for data validation
- **In-memory storage** (easily replaceable with database)

### UI/UX

- **Lucide React** icons
- **Custom eco-friendly color palette**
- **Responsive grid layouts**
- **Smooth animations and transitions**

## 📱 Application Structure

### Frontend (`client/`)

```
pages/
├── Index.tsx           # Main application page
└── NotFound.tsx        # 404 page

components/
├── ImageUpload.tsx     # Camera/file upload interface
├── CarbonScore.tsx     # Results display component
├── EcoRewards.tsx      # User rewards dashboard
├── OffersList.tsx      # Rewards marketplace
└── ui/                 # Reusable UI components
```

### Backend (`server/`)

```
routes/
├── demo.ts            # Image analysis API
├── eco-rewards.ts     # User rewards management
└── offers.ts          # Rewards marketplace API

index.ts               # Express server setup
```

### Shared (`shared/`)

```
api.ts                 # TypeScript interfaces for API
```

## 🔌 API Endpoints

### Image Analysis

- **POST** `/api/analyze-image`
  - Accepts: `{ imageData: string }` (base64 encoded image)
  - Returns: Analysis results with carbon footprint and earned points

### Eco Rewards

- **GET** `/api/eco-rewards`
  - Returns: User's total points, level, and environmental impact stats

### Offers & Redemption

- **GET** `/api/offers`
  - Returns: Available offers and user's current points
- **POST** `/api/redeem-offer`
  - Accepts: `{ offerId: string }`
  - Returns: Redemption confirmation and updated points

## 🌍 Carbon Footprint Assumptions

The application uses the following baseline carbon footprint values:

| Clothing Item | CO₂ Footprint (kg) | Category  |
| ------------- | ------------------ | --------- |
| T-Shirt       | 5.0                | Shirt     |
| Jeans         | 10.0               | Pants     |
| Dress         | 12.0               | Dress     |
| Sweater       | 9.0                | Sweater   |
| Jacket        | 15.0               | Outerwear |
| Coat          | 18.0               | Outerwear |
| Shorts        | 4.0                | Shorts    |

_Note: Values include ±20% variation to simulate real-world differences in materials, manufacturing processes, and transportation._

## 🎯 Eco-Rewards System

### Point Calculation

- **Base Points**: 50 points per clothing item analyzed
- **Carbon Bonus**: Up to 100 bonus points for low-carbon items
- **Level Multipliers**: Higher levels may receive point bonuses

### User Levels

- **Bronze**: 0-499 points
- **Silver**: 500-1,499 points
- **Gold**: 1,500-2,999 points
- **Platinum**: 3,000+ points

### Available Rewards

- Sustainable fashion discounts (500-1,200 points)
- Eco-product vouchers (600-1,000 points)
- Educational workshops (300 points)
- Tree planting certificates (1,000 points)
- Carbon offset purchases (1,500 points)

## 🛠️ Development

### Adding New Clothing Items

Edit the `CLOTHING_CARBON_DATABASE` in `server/routes/demo.ts`:

```typescript
const CLOTHING_CARBON_DATABASE = {
  "new-item": { carbonPerItem: 7.5, type: "category" },
  // ... existing items
};
```

### Adding New Offers

Edit the `AVAILABLE_OFFERS` array in `server/routes/offers.ts`:

```typescript
{
  id: "unique_offer_id",
  title: "Offer Title",
  description: "Detailed description",
  pointsCost: 750,
  category: "discount", // or "eco-product", "experience"
  expiresAt: "2024-12-31T23:59:59.000Z" // optional
}
```

### Testing

```bash
# Run test suite
npm test

# Type checking
npm run typecheck
```

## 🚀 Deployment

### Environment Variables

No environment variables required for basic functionality. For production, consider:

- Database connection strings
- External API keys (real image recognition service)
- Email service configuration
- Payment processing credentials

### Docker Support

```bash
# Build Docker image
docker build -t ecowear-app .

# Run container
docker run -p 8080:8080 ecowear-app
```

## 🔮 Future Enhancements

### Product Enhancements

1. **Real AI Integration**: Replace mock with actual GPT-4 Vision or custom trained models
2. **User Authentication**: Personal accounts and data persistence
3. **Social Features**: Share achievements, compare with friends
4. **Barcode Scanning**: Product identification via UPC/EAN codes
5. **Brand Database**: Real carbon footprint data from clothing manufacturers
6. **Wardrobe Tracking**: Full closet inventory management
7. **Sustainability Tips**: Personalized recommendations for eco-friendly choices

### Technical Enhancements

1. **Database Integration**: PostgreSQL/MongoDB for persistent storage
2. **Caching Layer**: Redis for improved performance
3. **Real-time Updates**: WebSocket integration for live notifications
4. **Progressive Web App**: Offline functionality and app-like experience
5. **Analytics Dashboard**: Admin panel for insights and monitoring
6. **API Rate Limiting**: Protection against abuse
7. **Comprehensive Testing**: E2E tests with Playwright/Cypress

### Integration Opportunities

1. **E-commerce Integration**: Partner with sustainable fashion brands
2. **Carbon Offset Providers**: Real tree planting and offset programs
3. **Sustainability Certifications**: GOTS, OEKO-TEX, Fair Trade verification
4. **Shipping Integration**: Carbon footprint of delivery options
5. **Recycling Programs**: Connection to textile recycling services

## ��� License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📞 Support

For questions or support, please contact [support@ecowear.app](mailto:support@ecowear.app) or open an issue on GitHub.

---

**Making fashion more sustainable, one analysis at a time! 🌱**
