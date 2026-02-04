# WISP Router Monitoring Solution

A solution to collect data from customer MikroTik routers and report to a central server.

## Architecture

- **Client Side**: RouterOS script running on each MikroTik router
- **Server Side**: REST API server to receive and store data
- **Data Collected**: Bandwidth usage, WiFi signal strengths, SSIDs, system metrics

## Server Setup

1. Install Node.js on your server
2. Clone or copy the server files
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Router Configuration

1. Modify the script with your server URL and API key
2. Upload the script to each MikroTik router
3. Run the script to test connectivity
4. Set up a scheduler to run the script periodically

## RouterOS Script Installation

1. Log into your MikroTik router via WinBox or terminal
2. Go to System > Scripts
3. Create a new script with the contents of `mikrotik-report-script.rsc`
4. Modify the `serverURL` and `apiKey` variables
5. Create a scheduler entry to run the script every 15 minutes

## Security Considerations

- Use HTTPS for the API endpoint
- Implement strong API keys for authentication
- Consider using certificates for mutual authentication
- Limit the ports and IPs that can access the server

## Data Schema

The server receives JSON data with the following structure:
```json
{
  "router_id": "router-name",
  "timestamp": "date time",
  "system_info": {
    "uptime": "uptime-string",
    "version": "router-os-version",
    "board_name": "board-name",
    "cpu_load": 15,
    ...
  },
  "interfaces": [
    {
      "name": "interface-name",
      "type": "ether/wifi",
      "rx_bytes": 123456,
      "tx_bytes": 789012,
      "running": true
    }
  ],
  "wireless": [
    {
      "name": "wlan1",
      "ssid": "CustomerNetwork",
      "band": "2ghz-b/g/n",
      "frequency": 2437,
      "tx_power": 20
    }
  ]
}
```

## Future Enhancements

- Database integration (PostgreSQL, InfluxDB)
- Real-time dashboard with Grafana
- Alerting for unusual usage patterns
- Historical data analysis
- Customer portal for usage statistics