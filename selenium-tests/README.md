# Saiyaara Jewelry Store - Selenium Test Suite

Comprehensive Selenium test automation suite for the Saiyaara jewelry e-commerce platform covering all customer and admin functionality.

## 🏗️ Test Architecture

- **Framework**: Selenium WebDriver with Python
- **Test Runner**: pytest
- **Design Pattern**: Page Object Model (POM)
- **Reporting**: HTML reports + Allure reports
- **Browser Support**: Chrome, Firefox, Edge
- **Parallel Execution**: pytest-xdist

## 📁 Project Structure

```
selenium-tests/
├── page_objects/           # Page Object Model classes
│   ├── base_page.py       # Base page with common methods
│   ├── home_page.py       # Home page elements and methods
│   ├── login_page.py      # Login page functionality
│   ├── shop_page.py       # Product catalog and shopping
│   ├── cart_page.py       # Shopping cart management
│   └── admin_page.py      # Admin panel functionality
├── tests/                 # Test cases organized by functionality
│   ├── test_home_page.py          # Home page tests
│   ├── test_authentication.py     # Login/logout tests
│   ├── test_product_catalog.py    # Product browsing tests
│   ├── test_shopping_cart.py      # Cart functionality tests
│   ├── test_admin_panel.py        # Admin panel tests
│   └── test_end_to_end.py         # Complete user journeys
├── reports/               # Test execution reports
├── conftest.py           # pytest configuration and fixtures
├── pytest.ini           # pytest settings and markers
├── requirements.txt      # Python dependencies
├── run_tests.py         # Test execution script
└── .env                 # Environment configuration
```

## 🚀 Quick Start

### 1. Setup Environment

```bash
# Install Python dependencies
pip install -r requirements.txt

# Setup test environment
python run_tests.py --setup
```

### 2. Configure Environment Variables

Update `.env` file with your application URLs:

```env
BASE_URL=http://localhost:3000
API_URL=http://localhost:8000/api
TEST_EMAIL=testuser@example.com
TEST_PASSWORD=testpassword123
ADMIN_EMAIL=admin@saiyaara.com
ADMIN_PASSWORD=admin123
```

### 3. Run Tests

```bash
# Run all tests
python run_tests.py

# Run specific test types
python run_tests.py --type smoke
python run_tests.py --type regression
python run_tests.py --type admin
python run_tests.py --type customer

# Run with different browsers
python run_tests.py --browser firefox
python run_tests.py --browser edge

# Run in headless mode
python run_tests.py --headless

# Run tests in parallel
python run_tests.py --parallel

# Generate Allure report
python run_tests.py --allure
```

## 📋 Test Categories

### 🏠 Home Page Tests (`test_home_page.py`)
- ✅ Page loading and essential elements
- ✅ Navigation menu functionality
- ✅ Featured products display
- ✅ Special offers navigation
- ✅ Theme toggle functionality
- ✅ Responsive design validation
- ✅ Performance testing
- ✅ SEO elements verification

### 🔐 Authentication Tests (`test_authentication.py`)
- ✅ Login page validation
- ✅ Valid user login
- ✅ Invalid credentials handling
- ✅ Form validation (empty fields, invalid email)
- ✅ Admin user login and redirection
- ✅ Session persistence
- ✅ Logout functionality
- ✅ Security testing (SQL injection, XSS protection)
- ✅ Multiple login attempts
- ✅ Password field security

### 🛍️ Product Catalog Tests (`test_product_catalog.py`)
- ✅ Shop page loading
- ✅ Product search functionality
- ✅ Category filtering
- ✅ Price range filtering
- ✅ Product sorting
- ✅ Product detail navigation
- ✅ Add to cart functionality
- ✅ Pagination
- ✅ Empty search results handling
- ✅ Product images loading
- ✅ Responsive product grid
- ✅ Search input validation

### 🛒 Shopping Cart Tests (`test_shopping_cart.py`)
- ✅ Cart page loading
- ✅ Empty cart display
- ✅ Add products to cart
- ✅ Quantity management (increase/decrease)
- ✅ Direct quantity updates
- ✅ Remove items from cart
- ✅ Cart total calculations
- ✅ Clear cart functionality
- ✅ Continue shopping
- ✅ Proceed to checkout
- ✅ Coupon code application
- ✅ Cart persistence
- ✅ Cart badge updates
- ✅ Responsive design

### 👨‍💼 Admin Panel Tests (`test_admin_panel.py`)
- ✅ Admin login and dashboard access
- ✅ Sidebar navigation
- ✅ Product management (CRUD operations)
- ✅ Order management
- ✅ User management
- ✅ Inventory management
- ✅ Security testing (access control, CSRF protection)
- ✅ Form validation
- ✅ Input sanitization
- ✅ Session timeout handling

### 🔄 End-to-End Tests (`test_end_to_end.py`)
- ✅ Complete guest shopping journey
- ✅ Complete registered user journey
- ✅ Product discovery paths
- ✅ Mobile user journey
- ✅ Cross-browser compatibility
- ✅ Error recovery scenarios
- ✅ Performance under load
- ✅ Accessibility testing
- ✅ SEO and metadata validation
- ✅ Data persistence testing
- ✅ Security throughout journey

## 🎯 Test Markers

Use pytest markers to run specific test categories:

```bash
# Smoke tests (critical functionality)
pytest -m smoke

# Regression tests (all features)
pytest -m regression

# Admin specific tests
pytest -m admin

# Customer facing tests
pytest -m customer

# Security tests
pytest -m security

# Performance tests
pytest -m performance

# Mobile tests
pytest -m mobile

# Slow running tests
pytest -m slow
```

## 📊 Test Reporting

### HTML Reports
- Generated automatically after test execution
- Located in `reports/report_TIMESTAMP.html`
- Self-contained with screenshots and logs

### Allure Reports
- Rich interactive reports with detailed test results
- Generate with `--allure` flag
- View at `reports/allure-report/index.html`

### Screenshots
- Automatic screenshot capture on test failures
- Stored in `reports/screenshots/`
- Embedded in HTML reports

## 🔧 Configuration

### Browser Configuration
- **Chrome**: Default browser with ChromeDriver auto-management
- **Firefox**: GeckoDriver auto-management
- **Edge**: EdgeDriver auto-management
- **Headless Mode**: Available for all browsers

### Parallel Execution
- Uses pytest-xdist for parallel test execution
- Automatically detects optimal worker count
- Reduces total execution time significantly

### Environment Variables
- `BASE_URL`: Frontend application URL
- `API_URL`: Backend API URL
- `TEST_EMAIL`: Test user email
- `TEST_PASSWORD`: Test user password
- `ADMIN_EMAIL`: Admin user email
- `ADMIN_PASSWORD`: Admin user password

## 🛡️ Security Testing

### Included Security Tests
- **SQL Injection**: Tests form inputs for SQL injection vulnerabilities
- **XSS Protection**: Validates cross-site scripting prevention
- **CSRF Protection**: Checks for CSRF tokens in forms
- **Input Sanitization**: Verifies malicious input handling
- **Access Control**: Tests unauthorized access prevention
- **Session Security**: Validates session timeout and management

### Authentication Security
- Password field masking
- Failed login attempt handling
- Session persistence validation
- Admin access control

## 📱 Mobile Testing

### Mobile Test Coverage
- Responsive design validation
- Touch interactions
- Mobile navigation
- Viewport-specific functionality
- Performance on mobile devices

### Supported Viewports
- **Mobile**: 375x667 (iPhone SE)
- **Tablet**: 1024x768 (iPad)
- **Desktop**: 1920x1080 (Full HD)

## ⚡ Performance Testing

### Performance Metrics
- Page load times
- Element interaction response times
- Search functionality performance
- Cart operations speed
- Navigation performance

### Load Simulation
- Rapid user interactions
- Multiple concurrent operations
- Stress testing scenarios

## 🔍 Accessibility Testing

### Accessibility Checks
- Keyboard navigation
- Alt text for images
- Form label associations
- Color contrast (basic validation)
- Screen reader compatibility

## 📈 Best Practices

### Test Design
- Page Object Model for maintainability
- Explicit waits for reliability
- Data-driven testing with Faker
- Independent test cases
- Proper test isolation

### Error Handling
- Graceful failure handling
- Detailed error reporting
- Screenshot capture on failures
- Retry mechanisms for flaky tests

### Maintenance
- Regular dependency updates
- Browser driver auto-management
- Modular test structure
- Clear test documentation

## 🚨 Troubleshooting

### Common Issues

**WebDriver Issues:**
```bash
# Update WebDriver
pip install --upgrade webdriver-manager
```

**Browser Compatibility:**
```bash
# Install specific browser drivers
pip install selenium==4.15.0
```

**Test Failures:**
- Check application is running on correct URLs
- Verify test data exists in database
- Check browser compatibility
- Review element locators

### Debug Mode
```bash
# Run with verbose output
pytest -v -s

# Run single test for debugging
pytest tests/test_home_page.py::TestHomePage::test_home_page_loads_successfully -v -s
```

## 📞 Support

For issues and questions:
- Check test logs in `reports/` directory
- Review browser console for JavaScript errors
- Verify application is running and accessible
- Check network connectivity to test URLs

## 🎯 Future Enhancements

- [ ] API testing integration
- [ ] Database validation
- [ ] Email testing
- [ ] Payment gateway testing
- [ ] Multi-language testing
- [ ] Advanced performance monitoring
- [ ] Visual regression testing
- [ ] CI/CD pipeline integration