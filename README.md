# Boutique Grand Nord ❄️

## Overview

**Boutique Grand Nord** is a web development project built as part of a Web Server Programming course at La Cité College.

The project consists of a small online store where customers can browse products, place orders, select delivery options, and add optional services.

It was developed using **Node.js, JavaScript, HTML, and CSS**, with a focus on server-side programming, HTTP requests, REST API concepts, and form handling.

The project was completed through all 13 steps of the Boutique Grand Nord laboratory.

## Features

### 1. Product Catalog
- Retrieve products from the server using a GET request.
- Display product names, prices, and available stock.
- Dynamically update the catalog.

### 2. Order Form
- Collect customer information (name and email).
- Select products and quantities.
- Choose between store pickup and home delivery.
- Add optional services:
  - Installation.
  - 3-year warranty.
- Handle multiple form fields using JavaScript FormData.

### 3. Order Processing
- Send orders to the server using POST requests.
- Read and parse incoming JSON data.
- Calculate order totals automatically.
- Apply delivery fees, optional services, and 13% HST.
- Generate an order confirmation.
- Automatically update product stock.

### 4. Server-Side Validation
The server validates incoming orders and handles different error scenarios:

| HTTP Status | Description |
|---|---|
| 201 Created | Order successfully created |
| 400 Bad Request | Missing or invalid information |
| 404 Not Found | Product does not exist |
| 409 Conflict | Requested quantity exceeds available stock |

### 5. Management Dashboard
- Display all submitted orders.
- Show customer names, products, quantities, delivery methods, and totals.
- Calculate total sales.
- Automatically refresh the dashboard every 5 seconds using polling.

## Technologies Used

- **Node.js** – Server-side runtime.
- **JavaScript (ES Modules)** – Application logic and API handling.
- **HTML5** – Web page structure and order forms.
- **CSS3** – User interface styling.
- **HTTP Module** – Creating the web server and handling requests.
- **Fetch API** – Communication between the browser and server.
- **FormData API** – Collecting form information.
- **JSON** – Data exchange between client and server.

## Project Structure

```text
boutique-grand-nord/
│
├── package.json
├── server.js
├── produits.js
│
└── public/
    ├── index.html
    ├── gestion.html
    ├── style.css
    ├── app.js
    └── gestion.js
```

## Installation and Setup

### Prerequisites

- Node.js installed.
- npm installed.
- Visual Studio Code (recommended).

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project directory

```bash
cd boutique-grand-nord
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Customer storefront:

```text
http://localhost:3000
```

Management dashboard:

```text
http://localhost:3000/gestion.html
```

Product API:

```text
http://localhost:3000/api/produits
```

Orders API:

```text
http://localhost:3000/api/commandes
```

## Learning Objectives

This laboratory helped develop practical skills in:

- Creating dynamic HTTP routes.
- Understanding GET and POST requests.
- Building and handling complex HTML forms.
- Using FormData, Number(), and getAll().
- Sending and receiving JSON data.
- Implementing server-side validation.
- Managing product inventory.
- Calculating prices and taxes.
- Building a dashboard with automatic data refresh.

## Important Note

This project is an educational demonstration. Orders and inventory are stored in server memory and are not permanently saved in a database. Data is reset when the server restarts.

