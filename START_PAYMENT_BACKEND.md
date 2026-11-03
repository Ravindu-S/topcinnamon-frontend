# How to Start the Payment Backend

## Quick Start

1. **Open a terminal in your project root directory**

2. **Navigate to the backend folder:**
   ```bash
   cd topcinnamon-backend
   ```

3. **Start the Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```

4. **Wait for the application to start** (you'll see "Started CinnamonProductsApplication" in the console)

5. **Test if the backend is running:**
   - Open your browser and go to: `http://localhost:8080/api/payment/health`
   - You should see: "Payment gateway is running"

## Testing the Payment Gateway

Once the backend is running, you can test payments with **any mock credit card details**:

### Test Credit Card Numbers:
- **Card Number:** `4111111111111111` (Visa test card)
- **Expiry:** Any future date (e.g., `12/2025`)
- **CVV:** Any 3 digits (e.g., `123`)
- **Cardholder Name:** Any name

### Important Notes:

1. **The backend uses a MOCK payment gateway** - it accepts ANY card details and simulates processing
2. **Success Rate:** 85% of payments will succeed (by design for testing)
3. **No real money is charged** - all transactions are simulated
4. **Database:** All payment records are saved to your existing MySQL database in the `payments` table

## Troubleshooting

### Problem: "Payment failed" error
- **Solution:** Make sure the backend is running (see step 3 above)
- Check that you can access `http://localhost:8080/api/payment/health`

### Problem: Backend won't start
- **Solution:** Make sure you have Java installed
- Try: `java -version` to verify Java is installed

### Problem: Port 8080 already in use
- **Solution:** Close any other application using port 8080
- Or check if there's already a backend instance running

## Payment Flow

1. User fills in payment form on the frontend
2. Payment details are sent to: `http://localhost:8080/api/payment/process`
3. Backend validates the request and creates a payment record
4. Mock gateway simulates processing (1-3 second delay)
5. 85% chance of success, 15% chance of failure (for testing)
6. If successful, payment record is saved to database with status "COMPLETED"
7. User is redirected to success page and cart is cleared

## Database Table

Payments are stored in the `payments` table with the following structure:
- `id` - Auto-generated ID
- `payment_id` - 4-digit incremental payment ID (e.g., "0001")
- `amount` - Payment amount
- `currency` - Currency (USD)
- `status` - Payment status (COMPLETED, FAILED, PENDING, etc.)
- `payment_method` - Payment method used
- `customer_email` - Customer email
- `gateway_transaction_id` - Mock transaction ID
- `created_at` - Timestamp
- Plus other fields for tracking

## Need Help?

If you're still having issues, check:
1. Is the backend running? (see health endpoint)
2. Is the database connected? (check application.properties)
3. Are there any error messages in the backend console?
