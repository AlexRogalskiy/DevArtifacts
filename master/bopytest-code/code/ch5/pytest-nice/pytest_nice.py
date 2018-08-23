import pytest

def pytest_report_header():
    if pytest.config.option.nice or pytest.config.getini('nice'):
        return "Thanks for running the tests."

def pytest_addoption(parser):
    group = parser.getgroup('nice')
    group.addoption("--nice", action="store_true",
                    help="nice: turn FAILED into OPPORTUNITY for improvement")


def pytest_report_teststatus(report):
    if pytest.config.option.nice and report.failed:
        return (report.outcome, 'O', 'OPPORTUNITY for improvement')
