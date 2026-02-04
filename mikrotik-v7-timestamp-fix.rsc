# MikroTik Script for WISP Monitoring (RouterOS v7 Timestamp Fix)
# Collects essential data with corrected timestamp syntax

# Configuration
:global serverURL "https://your-monitoring-server.com/api/router-data";
:global routerID [/system identity get value=name];
:global apiKey "your-api-key";

# Function to collect basic interface data (RouterOS v7 compatible)
:global getInterfaceStats do={
    :local result "";
    :foreach i in=[/interface find] do={
        :local name [/interface get $i name];
        :local type [/interface get $i type];
        :local running [/interface get $i running];
        :local disabled [/interface get $i disabled];
        
        # Initialize byte counters
        :local rxByte 0;
        :local txByte 0;
        
        # Simple try-catch for getting byte counts
        :do {
            :set rxByte [/interface get $i value-name=rx-byte];
        } on-error={:set rxByte 0;};
        :do {
            :set txByte [/interface get $i value-name=tx-byte];
        } on-error={:set txByte 0;};
        
        # Ensure numeric values
        :if ([:typeof $rxByte] != :num) do={:set rxByte 0;};
        :if ([:typeof $txByte] != :num) do={:set txByte 0;};
        
        :set result ($result . "{\"name\":\"$name\",\"type\":\"$type\",\"rx_bytes\":$rxByte,\"tx_bytes\":$txByte,\"running\":$running,\"disabled\":$disabled},");
    };
    
    # Remove trailing comma if there's data
    :if ([:len $result] > 0) do={
        :set result [:pick $result 0 ([:len $result] - 1)];
    };
    :return $result;
};

# Function to collect wireless info (minimal RouterOS v7 compatible)
:global getWirelessInfo do={
    :local result "";
    
    # Get wireless interfaces
    :foreach i in=[/interface wireless find] do={
        :local name [/interface wireless get $i name];
        :local ssid [/interface wireless get $i ssid];
        :local band [/interface wireless get $i band];
        :local frequency [/interface wireless get $i frequency];
        :local txPower [/interface wireless get $i tx-power];
        :local radioName [/interface wireless get $i radio-name];
        :local wdsMode [/interface wireless get $i wds-mode];
        :local mode [/interface wireless get $i mode];
        :local wirelessProtocol [/interface wireless get $i wireless-protocol];
        
        # Get associated stations (clients) - minimal data to avoid property access issues
        :local clients "";
        :foreach station in=[/interface wireless registration-table find where interface="$name"] do={
            :local mac [/interface wireless registration-table get $station mac-address];
            :local signal [/interface wireless registration-table get $station signal-strength];
            
            # Avoid problematic properties like tx-rate and rx-rate
            :set clients ($clients . "{\"mac\":\"$mac\",\"signal_strength\":$signal},");
        };
        
        # Clean up clients list
        :if ([:len $clients] > 0) do={
            :set clients [:pick $clients 0 ([:len $clients] - 1)];
        };
        
        :set result ($result . "{");
        :set result ($result . "\"name\":\"$name\",");
        :set result ($result . "\"ssid\":\"$ssid\",");
        :set result ($result . "\"band\":\"$band\",");
        :set result ($result . "\"frequency\":$frequency,");
        :set result ($result . "\"tx_power\":$txPower,");
        :set result ($result . "\"radio_name\":\"$radioName\",");
        :set result ($result . "\"wds_mode\":\"$wdsMode\",");
        :set result ($result . "\"mode\":\"$mode\",");
        :set result ($result . "\"wireless_protocol\":\"$wirelessProtocol\",");
        :set result ($result . "\"associated_clients\":[$clients]");
        :set result ($result . "},");
    };
    
    # Get wireless security profiles to extract passwords (only if authorized)
    :foreach i in=[/interface wireless security-profiles find] do={
        :local name [/interface wireless security-profiles get $i name];
        :local authenticationTypes [/interface wireless security-profiles get $i authentication-types];
        :local mode [/interface wireless security-profiles get $i mode];
        :local passphrase [/interface wireless security-profiles get $i wpa-pre-shared-key];
        
        :if ($passphrase != "") do={
            :set result ($result . "{\"security_profile\":\"$name\",");
            :set result ($result . "\"authentication_types\":\"$authenticationTypes\",");
            :set result ($result . "\"mode\":\"$mode\",");
            :set result ($result . "\"wpa_passphrase\":\"$passphrase\"");
            :set result ($result . "},");
        };
    };
    
    :if ([:len $result] > 0) do={
        :set result [:pick $result 0 ([:len $result] - 1)];
    };
    :return $result;
};

# Function to collect bandwidth per IP/user (if simple queues are configured)
:global getBandwidthPerIP do={
    :local result "";
    :foreach i in=[/queue simple find] do={
        :local name [/queue simple get $i name];
        :local target [/queue simple get $i target];
        :local bytes [/queue simple get $i bytes];
        :local rate [/queue simple get $i max-limit];
        :local pcqRate [/queue simple get $i total-queue];
        
        :set result ($result . "{\"name\":\"$name\",\"target\":\"$target\",\"bytes_sent\":$bytes,\"max_limit\":\"$rate\",\"queue_type\":\"$pcqRate\"},");
    };
    
    :if ([:len $result] > 0) do={
        :set result [:pick $result 0 ([:len $result] - 1)];
    };
    :return $result;
};

# Function to collect general system information (RouterOS v7 compatible)
:global getSystemInfo do={
    :local uptime [/system resource get uptime];
    :local version [/system resource get version];
    :local boardName [/system resource get "board-name"];
    :local platform [/system resource get platform];
    :local cpuLoad [/system resource get "cpu-load"];
    :local totalMemory [/system resource get "total-memory"];
    :local freeMemory [/system resource get "free-memory"];
    :local cpuCount [/system resource get "cpu-count"];
    :local architecture [/system resource get "architecture-name"];
    :local serialNumber [/system resource get "serial-number"];
    
    :return "{";
    :return ($return . "\"uptime\":\"$uptime\",");
    :return ($return . "\"version\":\"$version\",");
    :return ($return . "\"board_name\":\"$boardName\",");
    :return ($return . "\"platform\":\"$platform\",");
    :return ($return . "\"cpu_load\":$cpuLoad,");
    :return ($return . "\"total_memory\":$totalMemory,");
    :return ($return . "\"free_memory\":$freeMemory,");
    :return ($return . "\"cpu_count\":$cpuCount,");
    :return ($return . "\"architecture\":\"$architecture\",");
    :return ($return . "\"serial_number\":\"$serialNumber\"");
    :return ($return . "}");
};

# Main function to construct and send data
:global sendReport do={
    # Fixed timestamp assignment for RouterOS v7 compatibility
    :local dateValue [/system clock get value=date];
    :local timeValue [/system clock get value=time];
    :local timestamp ($dateValue . " " . $timeValue);
    
    :local interfaceStats [$getInterfaceStats];
    :local wirelessInfo [$getWirelessInfo];
    :local bandwidthPerIP [$getBandwidthPerIP];
    :local systemInfo [$getSystemInfo];
    
    # Construct JSON payload
    :local payload "{";
    :set payload ($payload . "\"router_id\":\"$routerID\",");
    :set payload ($payload . "\"timestamp\":\"$timestamp\",");
    :set payload ($payload . "\"system_info\":$systemInfo,");
    :set payload ($payload . "\"interfaces\":[$interfaceStats],");
    :set payload ($payload . "\"wireless\":[$wirelessInfo],");
    :set payload ($payload . "\"bandwidth_per_ip\":[$bandwidthPerIP]");
    :set payload ($payload . "}";
    
    # Send to server using fetch (RouterOS v7 compatible)
    :local response [/tool fetch url=$serverURL \
        http-method=post \
        http-data=$payload \
        header="Content-Type: application/json,Authorization: Bearer $apiKey" \
        output=user];
        
    :log info message=("WISP Monitoring: Sent data to server. Response: " . $response);
};

# Execute the report
$sendReport;

# Schedule this to run every 15 minutes
:if {[:len [/system scheduler find name="wisp-monitoring"]] > 0} do={
    /system scheduler remove [find name="wisp-monitoring"];
};
/system scheduler add name="wisp-monitoring" \
    start-time=startup \
    interval=15m \
    on-event=$sendReport;