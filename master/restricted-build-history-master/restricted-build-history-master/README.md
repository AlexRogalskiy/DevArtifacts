A group of Jenkins plugins providing

* An authorization strategy (descended from Project based matrix authorization strategy) which restricts access to build details to 
  * Administrators
  * User who initiated the build (or upstream job that initiated the build)
  * Unrestricted if build was initiated by anonymous user
* A build visibility action and publisher which will mark which builds are accessible by the current user in the build history widget