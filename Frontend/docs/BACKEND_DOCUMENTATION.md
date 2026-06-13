# Backend Architecture and API Documentation

This document outlines the technology stack and folder structure for the Gym Management Backend system. It is designed to serve as a robust, scalable RESTful API to communicate with a Typescript + React frontend application.

## Technology Stack

- **Framework**: [Laravel](https://laravel.com/) (PHP) - A robust MVC framework for building the core logic and routing.
- **Database**: **MySQL** - Relational database for storing users, memberships, products, and transactions.
- **Authentication**: **Laravel Sanctum** - Used to issue lightweight API tokens for authenticating requests from the React frontend.
- **API Architecture**: **RESTful API** - The frontend will consume data via JSON-based HTTP requests (GET, POST, PUT, DELETE).
- **Environment**: PHP 8.3+

---

## Folder Structure & File Definitions

Below is a breakdown of the critical directories and files in this backend project, detailing what each is responsible for in the context of an API backend.

### `/app`
Contains the core application logic.

- **`/app/Http/Controllers`**: 
  - *Purpose*: The brain of the API. Controllers receive HTTP requests from the React frontend, interact with the Models/Services to process data, and return JSON responses.
  - *Example*: `AuthController.php` (handles login/tokens), `MemberController.php` (handles member CRUD operations).
- **`/app/Http/Middleware`**: 
  - *Purpose*: Intercepts incoming requests before they hit the controller. Useful for checking if the React app sent a valid authentication token or has the right role (e.g., admin vs cashier).
- **`/app/Http/Requests`**: 
  - *Purpose*: Form Request validation classes. These validate the incoming data payload from the React frontend (e.g., ensuring a new member has a valid email format) before it reaches the controller.
- **`/app/Models`**: 
  - *Purpose*: Eloquent ORM classes that represent your database tables (e.g., `User.php`, `Membership.php`, `Product.php`). They define relationships (like a Member has many Transactions) and database interactions.
- **`/app/Services`**: 
  - *Purpose*: Contains business logic separated from controllers to keep the code clean and reusable.
- **`/app/Policies`**: 
  - *Purpose*: Authorization logic. Determines if a specific user is allowed to perform a specific action (e.g., only admins can delete a membership).

### `/routes`
Defines the entry points for the application.

- **`api.php`**: 
  - *Purpose*: **CRITICAL FILE**. All routes that the React frontend will call are defined here. These routes are automatically prefixed with `/api` and do not use session state, relying on token authentication (Sanctum) instead.
- **`web.php`**: 
  - *Purpose*: Typically used for browser-based routing with views, but in this API-only backend, it is mostly unused except for maybe a fallback route or a welcome page.
- **`console.php`**: 
  - *Purpose*: Defines custom Artisan terminal commands.

### `/database`
Manages the database structure and dummy data.

- **`/database/migrations`**: 
  - *Purpose*: Version control for the database schema. These files define how to create or modify tables (e.g., `create_users_table`, `create_memberships_table`). When you run `php artisan migrate`, it builds the MySQL database based on these files.
- **`/database/seeders`**: 
  - *Purpose*: Scripts to populate the database with initial or test data. Extremely useful for testing the React frontend against populated API endpoints.
- **`/database/factories`**: 
  - *Purpose*: Blueprints for generating fake data to be used by the seeders.

### `/config`
- *Purpose*: Contains all configuration files for the application (e.g., database connection settings, CORS settings, authentication settings). The React frontend will need `cors.php` properly configured to allow requests from the frontend domain/port.

### `/storage`
- *Purpose*: Used to store uploaded files (like member profile pictures or product images), application logs (`/storage/logs/laravel.log`), and framework-generated files. The frontend will request images stored here via public URLs.

### `/tests`
- *Purpose*: Contains automated tests (Unit and Feature tests) to ensure the API endpoints return the correct JSON structure and status codes.

### Key Root Files

- **`.env`**: 
  - *Purpose*: Environment variables. This is where you configure your MySQL database credentials, application keys, and API environment specifics. **Never commit this file to version control.**
- **`composer.json`**: 
  - *Purpose*: The PHP dependency manager configuration. It lists all the third-party packages installed in the project (like Laravel Framework, Sanctum, etc.).
- **`artisan`**: 
  - *Purpose*: The command-line interface included with Laravel. Used to run migrations, create controllers, and clear caches.

---

## Connecting to the Frontend

To connect the React + Typescript frontend to this backend:

1. Ensure the backend is running locally (`php artisan serve` typically on `http://127.0.0.1:8000`).
2. In the React app, set the base API URL to `http://127.0.0.1:8000/api`.
3. Ensure **CORS** (Cross-Origin Resource Sharing) is configured in the backend (usually via `config/cors.php`) to accept requests from the React app's development server (e.g., `http://localhost:5173` if using Vite).
4. Authenticate users via the `/api/login` endpoint to receive a Sanctum token, and include this token in the `Authorization: Bearer <token>` header for all subsequent protected API requests.


--path=api
  GET|HEAD        / ...................................................... routes/web.php:5
  POST            api/change-password ................... Api\AuthController@changePassword
  GET|HEAD        api/contracts .......... contracts.index › Admin\ContractController@index
  POST            api/contracts .......... contracts.store › Admin\ContractController@store
  GET|HEAD        api/contracts/{contract} . contracts.show › Admin\ContractController@show
  PUT|PATCH       api/contracts/{contract} contracts.update › Admin\ContractController@upd…
  DELETE          api/contracts/{contract} contracts.destroy › Admin\ContractController@de…
  POST            api/login ...................................... Api\AuthController@login
  POST            api/logout .................................... Api\AuthController@logout
  GET|HEAD        api/products ............. products.index › Admin\ProductController@index
  POST            api/products ............. products.store › Admin\ProductController@store
  GET|HEAD        api/products-paycheck products-paycheck.index › Admin\ProductPaycheckCon…
  POST            api/products-paycheck products-paycheck.store › Admin\ProductPaycheckCon…
  GET|HEAD        api/products-paycheck/{products_paycheck} products-paycheck.show › Admin…
  PUT|PATCH       api/products-paycheck/{products_paycheck} products-paycheck.update › Adm…
  DELETE          api/products-paycheck/{products_paycheck} products-paycheck.destroy › Ad…
  GET|HEAD        api/products/{product} ..... products.show › Admin\ProductController@show
  PUT|PATCH       api/products/{product} . products.update › Admin\ProductController@update
  DELETE          api/products/{product} products.destroy › Admin\ProductController@destroy
  POST            api/register ................................ Api\AuthController@register
  GET|HEAD        api/reports ................ reports.index › Admin\ReportController@index
  POST            api/reports ................ reports.store › Admin\ReportController@store
  GET|HEAD        api/reports/{report} ......... reports.show › Admin\ReportController@show
  PUT|PATCH       api/reports/{report} ..... reports.update › Admin\ReportController@update
  DELETE          api/reports/{report} ... reports.destroy › Admin\ReportController@destroy
  GET|HEAD        api/user .............................................. routes/api.php:24
  GET|HEAD        api/users ...................... users.index › Admin\UserController@index
  POST            api/users ...................... users.store › Admin\UserController@store
  POST            api/users/systemAccount ......... Admin\UserController@storeSystemAccount
  GET|HEAD        api/users/{user} ................. users.show › Admin\UserController@show
  PUT|PATCH       api/users/{user} ............. users.update › Admin\UserController@update
  DELETE          api/users/{user} ........... users.destroy › Admin\UserController@destroy
  PATCH           api/users/{user}/approve ............... Admin\UserController@approveUser
  PATCH           api/users/{user}/role ................... Admin\UserController@updateRole
  GET|HEAD        api/walkins ............ walkins.index › Admin\WalkInInfoController@index
  POST            api/walkins ............ walkins.store › Admin\WalkInInfoController@store
  GET|HEAD        api/walkins-attendance walkins-attendance.index › Admin\WalkInAttendance…
  POST            api/walkins-attendance walkins-attendance.store › Admin\WalkInAttendance…
  GET|HEAD        api/walkins-attendance/{walkins_attendance} walkins-attendance.show › Ad…
  PUT|PATCH       api/walkins-attendance/{walkins_attendance} walkins-attendance.update › …
  DELETE          api/walkins-attendance/{walkins_attendance} walkins-attendance.destroy  …
  GET|HEAD        api/walkins/{walkin} ..... walkins.show › Admin\WalkInInfoController@show
  PUT|PATCH       api/walkins/{walkin} . walkins.update › Admin\WalkInInfoController@update
  DELETE          api/walkins/{walkin} walkins.destroy › Admin\WalkInInfoController@destroy
  GET|HEAD        sanctum/csrf-cookie sanctum.csrf-cookie › Laravel\Sanctum › CsrfCookieCo…
  GET|HEAD        storage/{path} storage.local › vendor/laravel/framework/src/Illuminate/F…
  PUT             storage/{path} storage.local.upload › vendor/laravel/framework/src/Illum…
  GET|HEAD        up vendor/laravel/framework/src/Illuminate/Foundation/Configuration/Appl…



     