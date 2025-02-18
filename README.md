## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```dotenv
   PORT=3000
   JWT_ACCESS_SECRET=your_jwt_access_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   ```

## Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. The application should now be running at `http://localhost:3000`.
