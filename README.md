**API Ensek Test Project**

This project contains automated API tests built using Playwright for testing a fuel purchase system. The tests cover functionality such as resetting test data, buying fuel, and validating API responses.
This test framework is written in Microsoft playwright and javascript

**Prerequisites**
Before running the tests, ensure you have the following installed on your system:

Node.js (v12 or higher)

npm (comes bundled with Node.js)

Git (to clone the project)


**Next clone the rep**

```
git clone https://github.com/Duanem3/Ensek-Technical.git
```

Run this below command to install Playwright and dependencies

```
npm init playwright@latest
```

**Run the Tests**

Once the dependencies are installed, you can run the tests using the following command

```
npx playwright test

```

**View Test Results**

After running the tests, Playwright will generate an HTML report for detailed results. To open the report:

```
npx playwright show-report

```

**Future Enhancements**

Add more comprehensive boundary and validation testing.

Include performance testing for API calls.

Add retry logic for handling intermittent failures in token refresh.



