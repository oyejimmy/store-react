@echo off
echo ========================================
echo Saiyaara Jewelry Store - Test Suite
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Setup environment if needed
if not exist "venv" (
    echo Setting up virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Create reports directory
if not exist "reports" mkdir reports
if not exist "reports\allure-results" mkdir reports\allure-results
if not exist "reports\screenshots" mkdir reports\screenshots

echo.
echo ========================================
echo Test Execution Options:
echo ========================================
echo 1. Run All Tests
echo 2. Run Smoke Tests
echo 3. Run Regression Tests
echo 4. Run Admin Tests
echo 5. Run Customer Tests
echo 6. Run Security Tests
echo 7. Run Performance Tests
echo 8. Run Mobile Tests
echo 9. Custom Test Execution
echo 0. Exit
echo.

set /p choice="Enter your choice (0-9): "

if "%choice%"=="0" goto :end
if "%choice%"=="1" goto :all_tests
if "%choice%"=="2" goto :smoke_tests
if "%choice%"=="3" goto :regression_tests
if "%choice%"=="4" goto :admin_tests
if "%choice%"=="5" goto :customer_tests
if "%choice%"=="6" goto :security_tests
if "%choice%"=="7" goto :performance_tests
if "%choice%"=="8" goto :mobile_tests
if "%choice%"=="9" goto :custom_tests

echo Invalid choice. Please try again.
pause
goto :end

:all_tests
echo Running all tests...
python run_tests.py --type all --allure
goto :end

:smoke_tests
echo Running smoke tests...
python run_tests.py --type smoke --allure
goto :end

:regression_tests
echo Running regression tests...
python run_tests.py --type regression --allure
goto :end

:admin_tests
echo Running admin tests...
python run_tests.py --type admin --allure
goto :end

:customer_tests
echo Running customer tests...
python run_tests.py --type customer --allure
goto :end

:security_tests
echo Running security tests...
python run_tests.py --type security --allure
goto :end

:performance_tests
echo Running performance tests...
python run_tests.py --type performance --allure
goto :end

:mobile_tests
echo Running mobile tests...
python run_tests.py --type mobile --allure
goto :end

:custom_tests
echo.
echo Custom Test Options:
echo.
set /p browser="Enter browser (chrome/firefox/edge) [chrome]: "
if "%browser%"=="" set browser=chrome

set /p headless="Run in headless mode? (y/n) [n]: "
if "%headless%"=="y" (
    set headless_flag=--headless
) else (
    set headless_flag=
)

set /p parallel="Run tests in parallel? (y/n) [n]: "
if "%parallel%"=="y" (
    set parallel_flag=--parallel
) else (
    set parallel_flag=
)

set /p test_type="Enter test type (all/smoke/regression/admin/customer/security/performance/mobile) [all]: "
if "%test_type%"=="" set test_type=all

echo.
echo Running custom test configuration...
python run_tests.py --type %test_type% --browser %browser% %headless_flag% %parallel_flag% --allure

:end
echo.
echo ========================================
echo Test execution completed!
echo ========================================
echo.
echo Reports generated:
echo - HTML Report: reports\report_*.html
echo - Allure Report: reports\allure-report\index.html
echo.
echo Press any key to exit...
pause >nul