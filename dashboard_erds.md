# JH Dashboard - Entity Relationship Diagrams

## 1. Main Dashboard Data Structure
```mermaid
erDiagram
    DASHBOARD ||--o{ CLIENTS : displays
    DASHBOARD ||--o{ REVENUE : shows
    DASHBOARD ||--o{ OCCUPANCY : tracks
    DASHBOARD ||--o{ EXPENSES : monitors

    DASHBOARD {
        date date
        total_clients int
        total_revenue decimal
        average_cost_per_night decimal
        occupancy_rate decimal
    }
```

## 2. Client Data Structure
```mermaid
erDiagram
    CLIENTS ||--o{ STAYS : has
    CLIENTS ||--o{ PAYMENTS : makes

    CLIENTS {
        client_id int PK
        first_name string
        last_name string
        contact_number string
        email string
        join_date date
        status string
    }

    STAYS {
        stay_id int PK
        client_id int FK
        check_in_date date
        check_out_date date
        room_number string
        duration int
        cost_per_night decimal
    }

    PAYMENTS {
        payment_id int PK
        client_id int FK
        amount decimal
        payment_date date
        payment_method string
        status string
    }
```

## 3. Revenue and Expenses Structure
```mermaid
erDiagram
    REVENUE ||--o{ REVENUE_CATEGORIES : contains
    EXPENSES ||--o{ EXPENSE_CATEGORIES : contains

    REVENUE {
        revenue_id int PK
        date date
        amount decimal
        category_id int FK
        source string
        description text
    }

    REVENUE_CATEGORIES {
        category_id int PK
        name string
        description text
    }

    EXPENSES {
        expense_id int PK
        date date
        amount decimal
        category_id int FK
        description text
    }

    EXPENSE_CATEGORIES {
        category_id int PK
        name string
        description text
    }
```

## 4. Occupancy and Room Management
```mermaid
erDiagram
    ROOMS ||--o{ OCCUPANCY : tracks
    ROOMS ||--o{ MAINTENANCE : requires

    ROOMS {
        room_id int PK
        room_number string
        room_type string
        capacity int
        status string
        rate decimal
    }

    OCCUPANCY {
        occupancy_id int PK
        room_id int FK
        date date
        status string
        client_id int FK
    }

    MAINTENANCE {
        maintenance_id int PK
        room_id int FK
        date date
        type string
        status string
        cost decimal
    }
```

## 5. Reporting and Analytics Structure
```mermaid
erDiagram
    REPORTS ||--o{ METRICS : includes
    REPORTS ||--o{ CHARTS : contains

    REPORTS {
        report_id int PK
        report_type string
        date_range_start date
        date_range_end date
        generated_date date
    }

    METRICS {
        metric_id int PK
        report_id int FK
        name string
        value decimal
        unit string
        trend string
    }

    CHARTS {
        chart_id int PK
        report_id int FK
        chart_type string
        data_source string
        title string
    }
```

## 6. Data Flow Architecture
```mermaid
sequenceDiagram
    participant Dashboard
    participant PowerApps
    participant ExcelSheets

    Dashboard->>PowerApps: HTTP GET Request
    Note over Dashboard,PowerApps: Request includes:<br/>- Endpoint URL<br/>- Authentication Token<br/>- Query Parameters
    PowerApps->>ExcelSheets: Read Data
    Note over PowerApps,ExcelSheets: Data Access via:<br/>- SharePoint API<br/>- OneDrive API
    ExcelSheets-->>PowerApps: Return Data
    Note over PowerApps,ExcelSheets: Data includes:<br/>- Client Records<br/>- Financial Data<br/>- Room Status
    PowerApps-->>Dashboard: JSON Response
    Note over Dashboard,PowerApps: Response includes:<br/>- Status Code<br/>- Data Payload<br/>- Error Messages

    loop Data Refresh
        Dashboard->>PowerApps: Periodic Sync Request
        PowerApps->>ExcelSheets: Check for Updates
        ExcelSheets-->>PowerApps: New/Updated Data
        PowerApps-->>Dashboard: Updated Data
    end
```

## 7. API Endpoints Structure
```mermaid
graph TD
    A[Dashboard] -->|GET /api/clients| B[PowerApps]
    A -->|GET /api/revenue| B
    A -->|GET /api/occupancy| B
    A -->|GET /api/expenses| B
    
    B -->|SharePoint API| C[Excel Sheets]
    B -->|OneDrive API| C
    
    subgraph "Excel Sheets"
        C1[Clients.xlsx]
        C2[Rooms.xlsx]
        C3[Financial.xlsx]
        C4[Reports.xlsx]
    end
```

## 8. Data Synchronization Flow
```mermaid
flowchart LR
    A[Dashboard UI] -->|1. HTTP Request| B[PowerApps API]
    B -->|2. Authentication| C[Microsoft Graph API]
    C -->|3. Data Access| D[SharePoint/OneDrive]
    D -->|4. Excel Data| E[Excel Sheets]
    E -->|5. Process Data| B
    B -->|6. Transform Data| F[JSON Response]
    F -->|7. Update UI| A

    subgraph "PowerApps Processing"
        B -->|Validate Request| G[Request Validator]
        G -->|Check Permissions| H[Auth Manager]
        H -->|Fetch Data| I[Data Fetcher]
        I -->|Transform| J[Data Transformer]
        J -->|Format| K[Response Formatter]
    end
```

## API Integration Details

### 1. Dashboard to PowerApps Connection
```javascript
// Example API Request Structure
{
    endpoint: "https://api.powerapps.com/v1.0/...",
    method: "GET",
    headers: {
        "Authorization": "Bearer {token}",
        "Content-Type": "application/json"
    },
    params: {
        sheet: "Clients",
        dateRange: {
            start: "2024-01-01",
            end: "2024-03-31"
        }
    }
}
```

### 2. PowerApps to Excel Connection
```javascript
// Example Data Access Flow
1. PowerApps receives request
2. Validates authentication token
3. Connects to SharePoint/OneDrive
4. Accesses specific Excel file
5. Reads relevant worksheet
6. Processes and transforms data
7. Returns JSON response
```

### 3. Data Refresh Mechanism
```javascript
// Example Refresh Configuration
{
    refreshInterval: 300000, // 5 minutes
    sheets: [
        {
            name: "Clients",
            lastSync: "2024-03-20T10:00:00Z",
            nextSync: "2024-03-20T10:05:00Z"
        },
        {
            name: "Financial",
            lastSync: "2024-03-20T10:00:00Z",
            nextSync: "2024-03-20T10:05:00Z"
        }
    ]
}
```

### 4. Error Handling
```javascript
// Example Error Response
{
    status: "error",
    code: 500,
    message: "Failed to fetch data",
    details: {
        source: "Excel Sheet",
        error: "Connection timeout",
        timestamp: "2024-03-20T10:00:00Z"
    }
}
```

## Security Considerations
1. **Authentication**
   - OAuth 2.0 token validation
   - Role-based access control
   - Token expiration handling

2. **Data Protection**
   - HTTPS encryption
   - Data validation
   - Input sanitization

3. **Error Handling**
   - Graceful degradation
   - Error logging
   - User notifications

4. **Performance**
   - Caching strategy
   - Request batching
   - Data compression

## Excel Sheet Structure
The above ERDs correspond to the following Excel sheets that would be needed:

1. **Clients Sheet**
   - Client Information
   - Stay Records
   - Payment History

2. **Rooms Sheet**
   - Room Details
   - Occupancy Status
   - Maintenance Records

3. **Financial Sheet**
   - Revenue Records
   - Expense Records
   - Category Definitions

4. **Reports Sheet**
   - Daily/Monthly Reports
   - Key Metrics
   - Chart Configurations

## PowerApps Integration Points
1. **Data Sources**
   - SharePoint/OneDrive Excel files
   - Real-time data connections
   - Scheduled data refreshes

2. **Data Flow**
   - Excel → PowerApps → Dashboard
   - Automated data synchronization
   - Error handling and validation

3. **Security**
   - Access control
   - Data validation
   - Audit logging 