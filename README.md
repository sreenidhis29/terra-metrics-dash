# Terra Metrics Dashboard

A comprehensive agricultural AI analytics platform that provides real-time field monitoring, predictive analytics, and intelligent insights for modern farming operations.

## 🌾 Project Overview

The Terra Metrics Dashboard is a full-stack application that combines cutting-edge machine learning models with an intuitive web interface to help farmers monitor field health, predict crop yields, and make data-driven agricultural decisions.

### Key Features

- **Real-time Field Monitoring**: Track soil moisture, temperature, humidity, and nutrient levels
- **AI-Powered Health Analysis**: CNN model for field health assessment from satellite imagery
- **Yield Prediction**: LSTM model for accurate crop yield forecasting
- **Smart Alerts**: Automated notifications for pest risks, water stress, and disease outbreaks
- **Comprehensive Reports**: Detailed analytics and recommendations
- **Modern Dashboard**: Dark-themed, responsive interface with real-time data visualization

## 🏗️ Project Structure

```
terra-metrics-dash/
├── frontend/                    # React TypeScript frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Application pages
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions
│   │   └── assets/            # Static assets
│   ├── public/                # Public assets
│   └── package.json           # Frontend dependencies
├── backend/                    # FastAPI Python backend
│   ├── main.py                # Main API server
│   ├── inference.py           # AI model inference engine
│   ├── models/                # Trained ML models
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile             # Backend containerization
├── ml/                        # Machine learning notebooks
│   ├── cnn_model.ipynb        # CNN model development
│   └── lstm_model.ipynb       # LSTM model development
└── README.md                  # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.11+
- Docker (optional)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

The API will be available at `http://localhost:8000`

### Docker Setup (Optional)

```bash
# Build and run backend with Docker
cd backend
docker build -t terra-metrics-backend .
docker run -p 8000:8000 terra-metrics-backend

# Frontend (if needed)
cd frontend
docker build -t terra-metrics-frontend .
docker run -p 3000:3000 terra-metrics-frontend
```

## 🧠 AI Models

### CNN Model (Field Health Analysis)
- **Purpose**: Analyze satellite/drone imagery for field health assessment
- **Input**: 64x64 RGB images
- **Output**: Binary health classification (healthy/unhealthy)
- **Features**: Disease detection, pest identification, crop stress analysis

### LSTM Model (Yield Prediction)
- **Purpose**: Predict crop yields based on historical time series data
- **Input**: 30-day sequences of environmental and growth data
- **Output**: Yield prediction per hectare
- **Features**: Weather integration, seasonal trends, growth stage analysis

## 📊 API Endpoints

### Fields
- `GET /api/fields` - Get all fields
- `GET /api/fields/{field_id}` - Get specific field details
- `POST /api/fields` - Create new field

### Sensor Data
- `GET /api/sensor-data/{field_id}` - Get sensor readings
- `POST /api/predict/field-health` - AI health prediction
- `POST /api/predict/yield` - AI yield prediction

### Alerts
- `GET /api/alerts` - Get all alerts
- `GET /api/alerts/{alert_id}` - Get alert details

### Analytics
- `GET /api/analytics/health-summary` - Overall health summary
- `GET /api/analytics/trends/{field_id}` - Field trend analysis

### Reports
- `POST /api/reports/generate` - Generate new report
- `GET /api/reports/{report_id}` - Get report status

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for data fetching

### Backend
- **FastAPI** for API framework
- **TensorFlow/Keras** for ML models
- **Pydantic** for data validation
- **Uvicorn** for ASGI server
- **NumPy/Pandas** for data processing

### Machine Learning
- **TensorFlow 2.15** for deep learning
- **OpenCV** for image processing
- **Scikit-learn** for preprocessing
- **Jupyter Notebooks** for model development

## 🎨 UI/UX Features

- **Dark Theme**: Modern agricultural-themed dark interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Live data streaming and notifications
- **Interactive Maps**: Field visualization with health overlays
- **Data Visualization**: Charts, graphs, and trend analysis
- **Accessibility**: WCAG compliant design patterns

## 🔧 Development

### Adding New Features

1. **Frontend Components**: Add to `frontend/src/components/`
2. **API Endpoints**: Add to `backend/main.py`
3. **ML Models**: Develop in `ml/` notebooks, integrate via `backend/inference.py`

### Code Style

- **Frontend**: ESLint + Prettier configuration
- **Backend**: Black formatter, type hints with mypy
- **Git**: Conventional commits, feature branches

### Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

## 📈 Performance

- **Frontend**: Optimized bundle size, lazy loading, code splitting
- **Backend**: Async/await patterns, connection pooling
- **ML Models**: Model quantization, batch inference
- **Caching**: Redis integration for frequently accessed data

## 🔒 Security

- **Authentication**: JWT tokens with refresh mechanism
- **CORS**: Configured for development and production
- **Input Validation**: Pydantic models for all API inputs
- **Rate Limiting**: API endpoint protection
- **HTTPS**: SSL/TLS encryption in production

## 🌍 Deployment

### Production Deployment

1. **Frontend**: Build static files and deploy to CDN
2. **Backend**: Deploy to cloud platform (AWS, GCP, Azure)
3. **Database**: Set up PostgreSQL for production data
4. **ML Models**: Store in cloud storage (S3, GCS)

### Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://user:pass@localhost/db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Agricultural research institutions for dataset contributions
- Open source ML libraries (TensorFlow, OpenCV)
- UI component libraries (Shadcn/ui, Lucide React)
- The farming community for feedback and requirements

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation wiki

---

**Built with ❤️ for the future of agriculture**