# MikroTik Script for WISP Monitoring
# This script collects router data and sends it to a central server

# Configuration variables
:global serverURL "https://your-wisp-server.com/api/router-data";
:global routerID [/system identity get name];
:global apiKey "your-api-key";

# Function to collect interface traffic data
:global collectInterfaceData do={
    :local interfaceData [];
    :foreach i in=[/interface find] do={
        :local name [/interface get $i name];
        :local type [/interface get $i type];
        :local rxByte [/interface get $i rx-byte];
        :local txByte [/interface get $i tx-byte];
        :local running [/interface get $i running];
        
        :set interfaceData ($interfaceData,"{\"name\":\"$name\",\"type\":\"$type\",\"rx_bytes\":$rxByte,\"tx_bytes\":$txByte,\"running\":$running},");
    };
    :return $interfaceData;
};

# Function to collect wireless data (if wireless interface exists)
:global collectWirelessData do={
    :local wirelessData [];
    :foreach i in=[/interface wireless find] do={
        :local name [/interface wireless get $i name];
        :local ssid [/interface wireless get $i ssid];
        :local band [/interface wireless get $i band];
        :local frequency [/interface wireless get $i frequency];
        :local txPower [/interface wireless get $i tx-power];
        :local radioName [/interface wireless get $i radio-name];
        
        :set wirelessData ($wirelessData,"{\"name\":\"$name\",\"ssid\":\"$ssid\",\"band\":\"$band\",\"frequency\":$frequency,\"tx_power\":$txPower,\"radio_name\":\"$radioName\"},");
    };
    :return $wirelessData;
};

# Function to collect system info
:global collectSystemInfo do={
    :local uptime [/system resource get uptime];
    :local version [/system resource get version];
    :local boardName [/system resource get board-name];
    :local platform [/system resource get platform];
    :local cpuLoad [/system resource get cpu-load];
    :local totalMemory [/system resource get total-memory];
    :local freeMemory [/system resource get free-memory];
    :local cpuCount [/system resource get cpu-count];
    
    :return "{\"uptime\":\"$uptime\",\"version\":\"$version\",\"board_name\":\"$boardName\",\"platform\":\"$platform\",\"cpu_load\":$cpuLoad,\"total_memory\":$totalMemory,\"free_memory\":$freeMemory,\"cpu_count\":$cpuCount}";
};

# Main function to gather and send data
:global sendData do={
    :local timestamp [/system clock get date] . " " . [/system clock get time];
    :local interfaceData [$collectInterfaceData];
    :local wirelessData [$collectWirelessData];
    :local systemInfo [$collectSystemInfo];
    
    # Construct JSON payload
    :local jsonData "{\"router_id\":\"$routerID\",\"timestamp\":\"$timestamp\",\"system_info\":$systemInfo,\"interfaces\":[$interfaceData],\"wireless\":[$wirelessData]}";
    
    # Remove trailing commas
    :set jsonData [:tostr $jsonData];
    :set jsonData [:pick $jsonData 0 ([:len $jsonData] - 1)]; # Remove last comma
    :set jsonData ($jsonData . "}");
    
    # Send data to server
    /tool fetch url=$serverURL \
        http-method=post \
        http-data=$jsonData \
        header="Content-Type: application/json,Authorization: Bearer $apiKey" \
        dst-path=("report_" . [/system clock get date] . ".txt");
        
    :log info "Data sent to server: $jsonData";
};

# Execute the data collection and send
$sendData;

# Schedule this script to run every 15 minutes
/system scheduler add name="wisp-monitoring" \
    start-time=startup \
    interval=15m \
    on-event="/path/to/this/script.rsc";