# WISP Router Insight - Frontend Dashboard

A responsive web dashboard for monitoring MikroTik routers in a WISP environment.

## Features

- **Real-time Router Monitoring**: View status, uptime, bandwidth usage, and more
- **Advanced Filtering**: Filter routers by status, location, and bandwidth usage
- **Sorting Capabilities**: Sort by name, status, bandwidth, uptime, or location
- **Detailed Router Views**: Click on any router to see detailed system information
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Action Controls**: Restart or disconnect routers remotely (when implemented in backend)

## Components

- `index.html`: Main dashboard layout
- `styles.css`: Styling and responsive design
- `app.js`: Frontend logic and data handling
- `package.json`: Dependencies and scripts

## Setup Instructions

### For Development

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   or
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:3000`

### For Production

1. The frontend is designed to connect to the backend API at `/api/router-data`
2. Update the API endpoints in `app.js` to match your server configuration
3. Serve the files using any web server (Apache, Nginx, etc.)

## API Integration

The frontend currently uses simulated data. To connect to your backend server:

1. Update the `fetchRouterData()` function in `app.js` to fetch from your API:
   ```javascript
   async fetchRouterData() {
       const response = await fetch('/api/router-data');
       return response.json();
   }
   ```

2. Update other API calls (restart, disconnect, etc.) similarly

## Dashboard Sections

- **Sidebar Filters**: Filter routers by status, location, and bandwidth usage
- **Quick Stats**: At-a-glance overview of total routers, online/offline counts
- **Main Table**: Detailed view of all routers with sortable columns
- **Router Details Modal**: Click any router to see detailed system information

## Customization

- Update colors in `styles.css` to match your brand
- Modify the dashboard layout in `index.html`
- Add additional columns or filters in `app.js`
- Extend router details in the modal view

## Browser Support

Modern browsers supporting ES6+ JavaScript, Bootstrap 5, and CSS Grid/Flexbox.