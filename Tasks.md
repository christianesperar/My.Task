# Tasks
Write automated test cases for the following scenarios:

- **Login Functionality**:
  - Test successful login with valid credentials.
  - Test error handling for invalid login attempts (e.g., incorrect password, unregistered email).
  - Test that if the `lastUrl` exists, the user is redirected to that URL after logging in.
  - Test redirection to the login page when accessing the invites management UI without being logged in or verified.

- **Page and API Permissions**:
  - Test that only verified users can access the managing invites UI.
  - Test API calls related to managing invites (e.g., sending an invite, `fetching existing invites`) to ensure proper permissions are enforced.

- **Managing Invites Given**:
  - Test the functionality of the combobox for inviting users (searching and selecting an account).
  - Test that when toggling the `Write Posts` switch to enabled, the `Read Posts` switch is automatically enabled.
  - Test that when toggling the `Write Posts` switch to disabled, the `Read Posts` switch remains enabled, requiring manual toggling to disable it. 
  - Test sending an invite with specified permissions and ensure a confirmation dialog appears.
  - Test that the invite is shown in the table with correct information, including account details, time invited, and permissions granted.
  - Test that when attempting to invite a user who has already been invited, an appropriate error message is displayed
  - Test that pending/accepted invites can be deleted/trash.

- **ARIA Usability**:
  - Verify that tables interactive elements (buttons, navigations, etc) have appropriate ARIA labels and are keyboard accessible.