# ANPR E-Challan System

## Setup and Run

1.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the Application**:
    Navigate to the `app` directory and run flask (set the app file env var if usually needed, but `app.py` is default often, or better yet run directly or via python):
    ```bash
    cd app
    python app.py
    ```
    *Note: Since we use SocketIO, running via `python app.py` is preferred as it invokes `socketio.run`.*

3.  **Login Credentials**:
    - **Username**: `officer1`
    - **Password**: `12345`

## Features

- **Live Dashboard**: Simulates camera feeds. Click "Simulate Detection" to see real-time updates.
- **Manual Vehicle Check**: Enter `MH12DE1433` (Valid) or `KA05JA2024` (Expired PUC) to test.
- **Challan History**: View issued fines.
- **Profile**: View official's stats.
