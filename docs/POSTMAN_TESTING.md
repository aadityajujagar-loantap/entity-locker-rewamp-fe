# Postman Testing Guide

Use this guide with the Postman collection stored in:

```text
frontend/docs/postman/DigiDoc Portal APIs.postman_collection.json
frontend/docs/postman/DigiDoc Portal Local.postman_environment.json
```

Select environment:

```text
DigiDoc Portal Local
```

Environment variables:

```text
base_url        = http://localhost:8000
access_token    =
refresh_token   =
created_user_id =
```

Seeded admin login:

```json
{
  "login": "PF-0001",
  "password": "Admin@12345",
  "device_name": "postman"
}
```

Postman script location:

```text
Request -> Scripts -> Post-response
```

In older Postman versions, use:

```text
Request -> Tests
```

Do not put these scripts in source code files.

Response reminder:

```text
Use responseData, not data.
Example: body.responseData.accessToken
```

---

## Block 1: Authentication Module

Test this block first. It creates and validates the tokens used by every protected API.

### 1. Login

Postman request:

```text
Authentication Module -> Login
```

Request:

```http
POST {{base_url}}/api/v1/portal/auth/login
```

Authorization:

```text
No Auth
```

Body:

```json
{
  "login": "PF-0001",
  "password": "Admin@12345",
  "device_name": "postman"
}
```

Expected:

```text
200 OK
responseData.accessToken exists
responseData.refreshToken exists
```

Put this in `Login -> Scripts -> Post-response`:

```js
const body = pm.response.json();
const data = body.responseData || {};

pm.test("Login succeeded", function () {
  pm.expect(pm.response.code).to.eql(200);
});

pm.test("Tokens are present", function () {
  pm.expect(data.accessToken).to.be.a("string").and.not.empty;
  pm.expect(data.refreshToken).to.be.a("string").and.not.empty;
});

pm.environment.set("access_token", data.accessToken);
pm.environment.set("refresh_token", data.refreshToken);
```

### 2. Refresh Token

Postman request:

```text
Authentication Module -> Refresh Token
```

Request:

```http
POST {{base_url}}/api/v1/portal/auth/refresh
```

Authorization:

```text
Bearer Token: {{access_token}}
```

Body:

```json
{
  "refresh_token": "{{refresh_token}}",
  "device_name": "postman"
}
```

Expected:

```text
200 OK
new responseData.accessToken exists
new responseData.refreshToken exists
```

Put this in `Refresh Token -> Scripts -> Post-response`:

```js
const body = pm.response.json();
const data = body.responseData || {};

pm.test("Refresh succeeded", function () {
  pm.expect(pm.response.code).to.eql(200);
});

pm.test("New tokens are present", function () {
  pm.expect(data.accessToken).to.be.a("string").and.not.empty;
  pm.expect(data.refreshToken).to.be.a("string").and.not.empty;
});

pm.environment.set("access_token", data.accessToken);
pm.environment.set("refresh_token", data.refreshToken);
```

Important:

- Refresh requires bearer token plus `refresh_token` body.
- Refresh tokens rotate. Always use the newest `refresh_token`.
- If refresh works once and then fails, the old token was probably reused.

### 3. Get Authenticated User

Postman request:

```text
Authentication Module -> Get Authenticated User (Me)
```

Request:

```http
GET {{base_url}}/api/v1/portal/auth/me
```

Authorization:

```text
Bearer Token: {{access_token}}
```

Expected:

```text
200 OK
current user and roles returned
```

Optional script in `Get Authenticated User (Me) -> Scripts -> Post-response`:

```js
const body = pm.response.json();

pm.test("Me endpoint succeeded", function () {
  pm.expect(pm.response.code).to.eql(200);
  pm.expect(body.responseData).to.exist;
});
```

### 4. Change Password

Postman request:

```text
Authentication Module -> Change Password
```

Request:

```http
POST {{base_url}}/api/v1/portal/auth/change-password
```

Authorization:

```text
Bearer Token: {{access_token}}
```

Body:

```json
{
  "current_password": "Admin@12345",
  "password": "NewAdminPassword@123",
  "password_confirmation": "NewAdminPassword@123"
}
```

Expected:

```text
200 OK
Password changed successfully
```

Run this only if you are okay changing the local admin password.

### 5. Logout

Postman request:

```text
Authentication Module -> Logout
```

Request:

```http
POST {{base_url}}/api/v1/portal/auth/logout
```

Authorization:

```text
Bearer Token: {{access_token}}
```

Body:

```json
{
  "refresh_token": "{{refresh_token}}"
}
```

Expected:

```text
200 OK
Logged out successfully
```

Test logout last. It revokes tokens.

---

## Block 2: User Management Module

All requests in this block require admin auth:

```text
Authorization -> Bearer Token -> {{access_token}}
```

Valid roles:

```text
admin
branch_manager
branch_user
```

Valid statuses:

```text
ACTIVE
INACTIVE
LOCKED
PASSWORD_EXPIRED
```

### 1. List Users

Postman request:

```text
User Management Module -> List Users
```

Request:

```http
GET {{base_url}}/api/v1/portal/users
```

Expected:

```text
200 OK
users list returned
```

### 2. Create User

Postman request:

```text
User Management Module -> Create User
```

Request:

```http
POST {{base_url}}/api/v1/portal/users
```

Body:

```json
{
  "employee_id": "EMP-1001",
  "pf_number": "PF-1001",
  "name": "Branch User One",
  "email": "branch.user.1001@example.com",
  "mobile": "9876543210",
  "branch_code": "BR001",
  "branch_name": "Main Branch",
  "status": "ACTIVE",
  "password": "Password@123",
  "roles": ["branch_user"]
}
```

Expected:

```text
201 Created
created user returned
```

Put this in `Create User -> Scripts -> Post-response`:

```js
const body = pm.response.json();
const data = body.responseData || {};

pm.test("User created", function () {
  pm.expect(pm.response.code).to.eql(201);
  pm.expect(data.id).to.exist;
});

pm.environment.set("created_user_id", data.id);
```

If validation fails, change these unique fields:

```text
employee_id
pf_number
email
```

### 3. Get User

Postman request:

```text
User Management Module -> Get User
```

Request:

```http
GET {{base_url}}/api/v1/portal/users/{{created_user_id}}
```

Expected:

```text
200 OK
selected user returned
```

### 4. Update User

Postman request:

```text
User Management Module -> Update User
```

Request:

```http
PUT {{base_url}}/api/v1/portal/users/{{created_user_id}}
```

Body:

```json
{
  "name": "Updated Branch User",
  "mobile": "9999999999",
  "roles": ["branch_user"]
}
```

Expected:

```text
200 OK
updated user returned
```

### 5. Update User Status

Postman request:

```text
User Management Module -> Update User Status
```

Request:

```http
PATCH {{base_url}}/api/v1/portal/users/{{created_user_id}}/status
```

Body:

```json
{
  "status": "INACTIVE"
}
```

Expected:

```text
200 OK
status updated
```

### 6. Reset User Password

Postman request:

```text
User Management Module -> Reset User Password
```

Request:

```http
POST {{base_url}}/api/v1/portal/users/{{created_user_id}}/reset-password
```

Body:

```json
{
  "password": "NewPassword@123"
}
```

Expected:

```text
200 OK
password reset successfully
```

### Optional RBAC Check

Login as the created branch user:

```json
{
  "login": "PF-1001",
  "password": "NewPassword@123",
  "device_name": "postman-created-user"
}
```

Then call:

```http
GET {{base_url}}/api/v1/portal/users
```

Expected:

```text
403 Forbidden
```

After this check, login again as admin before continuing admin tests.

---

## Block 3: User Profile Module

All requests in this block require:

```text
Authorization -> Bearer Token -> {{access_token}}
```

### 1. Get Profile

Postman request:

```text
User Profile Module -> Get Profile
```

Request:

```http
GET {{base_url}}/api/v1/portal/profile
```

Expected:

```text
200 OK
profile returned for logged-in user
```

### 2. Update Profile

Postman request:

```text
User Profile Module -> Update Profile
```

Request:

```http
PUT {{base_url}}/api/v1/portal/profile
```

Body:

```json
{
  "name": "System Admin",
  "email": "admin@mahabank.local",
  "mobile": "9876543210"
}
```

Expected:

```text
200 OK
updated profile returned
```

---

## Block 4: Entity Locker Provider

All requests in this block require:

```text
Authorization -> Bearer Token -> {{access_token}}
```

Currently implemented endpoint:

```text
Generate Authorization URL
```

The provider callback/token exchange flow is not implemented yet.

### 1. Generate Authorization URL

Postman request:

```text
Entity Locker Provider -> Generate Authorization URL
```

Request:

```http
GET {{base_url}}/api/v1/portal/providers/entity-locker/authorization-url
```

Expected:

```text
200 OK
responseData.authorization_url exists
responseData.state exists
responseData.code_challenge exists
responseData.redirect_uri exists
```

Put this in `Generate Authorization URL -> Scripts -> Post-response`:

```js
const body = pm.response.json();
const data = body.responseData || {};

pm.test("Authorization URL generated", function () {
  pm.expect(pm.response.code).to.eql(200);
  pm.expect(data.authorization_url).to.be.a("string").and.not.empty;
  pm.expect(data.state).to.be.a("string").and.not.empty;
  pm.expect(data.code_challenge).to.be.a("string").and.not.empty;
  pm.expect(data.redirect_uri).to.be.a("string").and.not.empty;
});
```

---

Quick failure checks:

| Symptom | Likely Cause | Fix |
|---|---|---|
| Login fails | DB not seeded or wrong credentials | Seed DB or use a valid local user |
| Refresh returns `401` | Missing bearer token | Add `Bearer {{access_token}}` |
| Refresh returns `404` | Old/missing refresh token | Login again and save latest token |
| Protected APIs return `401` | Missing/expired access token | Refresh or login again |
| User APIs return `403` | User is not admin | Login as seeded admin |
| Create user validation fails | Duplicate unique fields | Change employee ID, PF number, email |
