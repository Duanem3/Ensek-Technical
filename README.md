**Ensek Tech test**

Hi and thanks for the opportunity to do this test. 

Here are the google docs files to my test strategy and some of the issues and bugs i found whilst testing. I didnt do a full test of all the scenarios i created as there was so many. I have just listed the ones that i saw whilst creating the test scenarios and also creating the api tests

Please if you have any questions about anything then please contact me and i will gladly assist you

Test Cases: https://docs.google.com/spreadsheets/d/1JYYUPFDMzMsFeVBhucNaHwTDZDoZmrv2H8LXAIqzm2Y/edit?usp=sharing

Test Strategy Doc: https://docs.google.com/document/d/1jCBHlLIwqrS99Hd01O3MXKWl0YZhO14twVP-rZebBCA/edit?usp=sharing

UI Bugs and Issues found: https://docs.google.com/document/d/1HaA81JtDZOGGgJB9JT8pZMBJo9MNbuviI1Mz6FvCrSI/edit?usp=sharing

API bugs and issues found: https://docs.google.com/document/d/1UwseiLoQEOsPuZITrdy_AV9WS8PGVpXhkAAa8Qm1Meo/edit?usp=sharing




**API Ensek API Test Project**

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



