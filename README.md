# ERIO Dashboard - University International Office

A modern, glassmorphism-designed dashboard for the University International Office to track and visualize international partnerships, student exchanges, and engagement metrics.

## Features

- **Dashboard View**: Comprehensive overview of key metrics including:
  - Partner universities count
  - Active agreements
  - Student exchanges
  - Events and activities
  - Engagement trends with interactive charts
  - Recent activities feed

- **World Map View**: Interactive world map showing:
  - Location of all partner universities
  - Clickable markers for detailed information
  - Partner university cards with quick stats
  - Detailed modal view for each partner

- **Modern Design**:
  - Glassmorphism UI with translucent frosted-glass cards
  - Warm beige and sand-toned background
  - Light pink gradient accents
  - Organic minimalist aesthetic with smooth shapes
  - Responsive design for all devices

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Beautiful charts and data visualization
- **React Simple Maps** - Interactive world map component
- **Lucide React** - Modern icon library

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard with stats and charts
│   ├── Header.jsx             # Navigation header
│   ├── WorldMap.jsx           # Interactive world map view
│   ├── PartnerDetails.jsx    # Partner university details modal
│   ├── StatsCard.jsx          # Reusable stat card component
│   ├── EngagementChart.jsx    # Engagement trends chart
│   ├── RecentActivities.jsx   # Recent activities feed
│   └── OrganicShapes.jsx      # Background decorative shapes
├── App.jsx                    # Main app component
├── main.jsx                   # React entry point
└── index.css                  # Global styles and Tailwind
```

## Design Philosophy

This dashboard follows a **glassmorphism** design language with:

- **Translucent Cards**: Frosted glass effect with backdrop blur
- **Organic Minimalism**: Soft, rounded shapes and natural textures
- **Warm Color Palette**: Beige and sand tones with light pink accents
- **Clear Spacing**: Generous padding and margins for an airy feel
- **Subtle Depth**: Soft shadows and layering for visual hierarchy
- **Modern Typography**: Clean sans-serif fonts with clear hierarchy

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:
- `beige` - Background and neutral tones
- `pink` - Accent colors (replace orange/peach from reference)

### Partner Universities

Edit the `partnerUniversities` array in `src/components/WorldMap.jsx` to add or modify partner university data.

### Dashboard Metrics

Modify the `stats` array in `src/components/Dashboard.jsx` to customize the metrics displayed.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for the University International Office.
