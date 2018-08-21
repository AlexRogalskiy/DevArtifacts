Feature: ReST Test
  To check if Jenkins ReST API has the project name information.

  Scenario: Access API
    Given Our API is located at #http://localhost:8080/job/Struts-Spring-Example/api/json#
    When The data is fetched
    Then The API result should contain project name 'Struts-Spring-Example'