const { test, expect } = require('@playwright/test');

// This ensures that Playwright doesn't launch any browser for these tests
test.use({ browserName: 'null' });

// Global setup for the API context and token
let apiContext;
let authToken;
let capturedOrders = []; // To store the captured orders

// Function to login and retrieve the token
async function loginAndGetToken(playwright) {
  // Create a new API request context, needed to run API tests
  const loginContext = await playwright.request.newContext();
  
  // Perform login to get a fresh token
  const loginResponse = await loginContext.post('https://qacandidatetest.ensek.io/ENSEK/login', {
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      username: 'test', 
      password: 'testing'
    }
  });

  // Assert login is successful and token is present
  expect(loginResponse.status()).toBe(200);

  const loginData = await loginResponse.json();
  authToken = loginData.access_token; // Extract the token from the response
  console.log('Login Response:', loginData);
}

// This will run before each test, ensuring the token is fresh and that you are authenticated
test.beforeEach(async ({ playwright }) => {
  // Perform login and get a fresh token before each test
  await loginAndGetToken(playwright);

  // Create a context with the fresh token
  apiContext = await playwright.request.newContext({
    baseURL: 'https://qacandidatetest.ensek.io',
    extraHTTPHeaders: {
      'accept': 'application/json',
      'Authorization': `Bearer ${authToken}`, // Use the fresh token dynamically for each run
    },
  });
});

// Function to reset test data
async function resetTestData() {
  const response = await apiContext.post('/ENSEK/reset');

  // Log the response for debugging purposes
  const responseBody = await response.json();
  console.log('Reset Response:', responseBody);

  // Assert the response status is 200 (OK)
  expect(response.status()).toBe(200);

  // Assert that the response contains the message "Success"
  expect(responseBody.message).toBe('Success');
}

// Function to buy fuel and capture order ID for use later
async function buyFuel(fuelId, fuelType, quantity) {
  const response = await apiContext.put(`/ENSEK/buy/${fuelId}/${quantity}`);
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log(`Fuel ID: ${fuelId}, Purchase Response:`, responseBody);
  
  // Regex to capture Order Id from the Buy fuel response
  const orderIdMatch = responseBody.message.match(/id\s?is\s?(\w{8}-\w{4}-\w{4}-\w{4}-\w{12})/);

  let orderId = null;
  if (orderIdMatch) {
    orderId = orderIdMatch[1];
    console.log(`Captured Order ID: ${orderId}`);
  }
  return { orderId, fuelType, quantity };
}

// Test to verify all order details from /orders API
test('Verify all order details from /orders API', async () => {
  // Buy and capture the orders
  const gasOrder = await buyFuel(1, 'gas', 100);  // Buy 100 units of Gas (ID = 1)
  const electricityOrder = await buyFuel(3, 'Elec', 150);  // Buy 150 units of Electricity (ID = 3)
  const oilOrder = await buyFuel(4, 'Oil', 80);  // Buy 80 units of Oil (ID = 4)

  capturedOrders.push(gasOrder, electricityOrder, oilOrder);

  console.log('Captured Orders:', capturedOrders);

  // Call the /orders API to fetch the list of orders
  const ordersResponse = await apiContext.get('/ENSEK/orders');

  // Verify order API returns a successful 200 response
  expect(ordersResponse.status()).toBe(200);

  const ordersData = await ordersResponse.json();
  console.log('Orders Response:', ordersData);

  // Verify each captured order's details
  capturedOrders.forEach((capturedOrder) => {
    // Find the specific order by the captured orderId
    const order = ordersData.find(o => 
      (o.id === capturedOrder.orderId || o.Id === capturedOrder.orderId)
    );

    // Verify the order exists
    expect(order).toBeDefined();
    console.log(`Order Found for ${capturedOrder.fuelType}:`, order);

    // Verify that the fuel type and quantity are correct
    expect(order.fuel).toBe(capturedOrder.fuelType);
    expect(order.quantity).toBe(capturedOrder.quantity);
  });
});

// Function to count orders before the current date
async function countOrdersBeforeCurrentDate() {
  // Call the /orders API to fetch the list of orders
  const ordersResponse = await apiContext.get('/ENSEK/orders');
  expect(ordersResponse.status()).toBe(200);

  const ordersData = await ordersResponse.json();
  console.log('Orders Response:', ordersData);

  // Get today's date and set time to 00:00:00 (midnight)
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);  // Reset time to midnight

  // Filter the orders created before today
  const ordersBeforeToday = ordersData.filter(order => {
    const orderDate = new Date(order.time);
    orderDate.setHours(0, 0, 0, 0);  // Reset order date time to midnight
    return orderDate < todayDate;
  });

  // Log how many orders were created before today
  console.log(`Number of orders before today: ${ordersBeforeToday.length}`);

  return ordersBeforeToday.length;
}

// Test to verify how many orders were created before the current date
test('Verify number of orders created before the current date', async () => {
  const numberOfOrdersBeforeToday = await countOrdersBeforeCurrentDate();

  // Assert the number of orders is as expected
  expect(numberOfOrdersBeforeToday).toBeGreaterThan(0); // Check that the number is greater than 0
});

// Error handling tests for invalid fuel type
test('Error handling - Invalid fuel type', async () => {
  const response = await apiContext.put('/ENSEK/buy/999/100'); // Invalid fuelId
  expect(response.status()).toBe(400);  // Check if a proper error is returned
});

// Test to verify the correct message when trying to purchase unavailable fuel (Nuclear)
test('Verify validation message when purchasing unavailable fuel(Nuclear)', async () => {
  // Try to buy 2 units of Nuclear fuel (which is unavailable)
  const response = await apiContext.put('/ENSEK/buy/2/2');
  
  // Verify the response status is 200 (successful request)
  expect(response.status()).toBe(200);
  
  // Extract and verify the response message
  const responseBody = await response.json();
  console.log('Purchase Response:', responseBody);
  
  // Assert that the message matches the expected message
  expect(responseBody.message).toBe('There is no nuclear fuel to purchase!');
});
