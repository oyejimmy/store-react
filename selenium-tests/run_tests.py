#!/usr/bin/env python3
"""
Test Runner Script for Saiyaara Jewelry Store Selenium Tests
"""

import os
import sys
import subprocess
import argparse
from datetime import datetime

def run_command(command):
    """Execute command and return result"""
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def setup_environment():
    """Setup test environment"""
    print("Setting up test environment...")
    
    # Create reports directory
    os.makedirs("reports", exist_ok=True)
    os.makedirs("reports/allure-results", exist_ok=True)
    os.makedirs("reports/screenshots", exist_ok=True)
    
    # Install dependencies
    print("Installing dependencies...")
    success, stdout, stderr = run_command("pip install -r requirements.txt")
    if not success:
        print(f"Failed to install dependencies: {stderr}")
        return False
    
    return True

def run_tests(test_type="all", browser="chrome", headless=False, parallel=False):
    """Run tests based on specified parameters"""
    
    # Base pytest command
    cmd = ["python", "-m", "pytest"]
    
    # Add test selection based on type
    if test_type == "smoke":
        cmd.extend(["-m", "smoke"])
    elif test_type == "regression":
        cmd.extend(["-m", "regression"])
    elif test_type == "admin":
        cmd.extend(["-m", "admin"])
    elif test_type == "customer":
        cmd.extend(["-m", "customer"])
    elif test_type == "security":
        cmd.extend(["-m", "security"])
    elif test_type == "performance":
        cmd.extend(["-m", "performance"])
    elif test_type == "mobile":
        cmd.extend(["-m", "mobile"])
    elif test_type != "all":
        # Run specific test file
        cmd.append(f"tests/{test_type}")
    
    # Add browser configuration
    if browser != "chrome":
        cmd.extend(["--browser", browser])
    
    # Add headless mode
    if headless:
        cmd.extend(["--headless"])
    
    # Add parallel execution
    if parallel:
        cmd.extend(["-n", "auto"])
    
    # Add reporting
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    cmd.extend([
        "--html", f"reports/report_{timestamp}.html",
        "--self-contained-html",
        "--alluredir", "reports/allure-results"
    ])
    
    # Execute tests
    print(f"Running tests with command: {' '.join(cmd)}")
    success, stdout, stderr = run_command(" ".join(cmd))
    
    if success:
        print("Tests completed successfully!")
        print(f"HTML Report: reports/report_{timestamp}.html")
    else:
        print(f"Tests failed: {stderr}")
    
    return success

def generate_allure_report():
    """Generate Allure report"""
    print("Generating Allure report...")
    success, stdout, stderr = run_command("allure generate reports/allure-results -o reports/allure-report --clean")
    
    if success:
        print("Allure report generated: reports/allure-report/index.html")
        # Try to open report
        run_command("allure open reports/allure-report")
    else:
        print(f"Failed to generate Allure report: {stderr}")
    
    return success

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Run Saiyaara Selenium Tests")
    
    parser.add_argument(
        "--type", 
        choices=["all", "smoke", "regression", "admin", "customer", "security", "performance", "mobile"],
        default="all",
        help="Type of tests to run"
    )
    
    parser.add_argument(
        "--browser",
        choices=["chrome", "firefox", "edge"],
        default="chrome",
        help="Browser to use for testing"
    )
    
    parser.add_argument(
        "--headless",
        action="store_true",
        help="Run tests in headless mode"
    )
    
    parser.add_argument(
        "--parallel",
        action="store_true",
        help="Run tests in parallel"
    )
    
    parser.add_argument(
        "--setup",
        action="store_true",
        help="Setup test environment"
    )
    
    parser.add_argument(
        "--allure",
        action="store_true",
        help="Generate Allure report after tests"
    )
    
    args = parser.parse_args()
    
    # Setup environment if requested
    if args.setup:
        if not setup_environment():
            sys.exit(1)
    
    # Run tests
    success = run_tests(
        test_type=args.type,
        browser=args.browser,
        headless=args.headless,
        parallel=args.parallel
    )
    
    # Generate Allure report if requested
    if args.allure:
        generate_allure_report()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()