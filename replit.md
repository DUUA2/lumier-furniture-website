# Lumier Furniture - E-Commerce Platform

## Overview

Lumier Furniture is a modern e-commerce platform specializing in luxury furniture sales and rentals for the Nigerian market. The application provides customers with flexible payment options, allowing them to either purchase furniture outright or rent with customizable payment plans. The platform features a comprehensive product catalog, shopping cart functionality, and streamlined checkout process with BVN verification integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and custom hooks for client state
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens for brand consistency
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Schema Management**: Drizzle Kit for migrations and schema updates
- **Session Management**: Memory-based storage with fallback to PostgreSQL sessions

### Build and Development
- **Development**: TSX for TypeScript execution with hot reloading
- **Production**: ESBuild for server bundling, Vite for client bundling
- **Deployment**: Replit-optimized with autoscale deployment target

## Key Components

### Database Schema
The application uses three main entities:

1. **Users Table**: Stores customer information including authentication details, personal info, and BVN
2. **Products Table**: Contains furniture catalog with pricing, categories, colors, specifications, and stock status
3. **Orders Table**: Manages customer orders with delivery details, payment plans, and item information

### Product Management
- Comprehensive product catalog with categories (Living Room, Bedroom, Dining Room, Office)
- Multi-color variants and detailed specifications (dimensions, material, weight)
- Flexible pricing with support for both purchase and rental models
- Stock management and availability tracking

### Shopping Cart System
- Persistent cart storage using localStorage
- Support for both purchase and rental options
- Quantity management and item customization
- Real-time price calculations including VAT and delivery fees

### Order Processing
- Multi-step checkout with customer information collection
- BVN verification integration for payment security
- Flexible payment plans (1, 3, 6, 12 months)
- Delivery address and next-of-kin information capture

### Payment Integration
- Monthly payment calculation based on selected plan duration
- VAT calculation (7.5% standard rate)
- Delivery fee structure with state-based pricing
- Order confirmation and tracking system

## Data Flow

1. **Product Discovery**: Users browse products via the home page or explore page with filtering capabilities
2. **Product Selection**: Detailed product pages display specifications, pricing options, and color variants
3. **Cart Management**: Selected items are added to cart with type (buy/rent) and customization options
4. **Checkout Process**: Multi-step form collects customer details, delivery information, and payment preferences
5. **Order Creation**: Validated order data is processed and stored with unique order tracking number
6. **Confirmation**: Users receive order confirmation with payment plan details

## External Dependencies

### UI and Styling
- Radix UI primitives for accessible component foundation
- Tailwind CSS for utility-first styling approach
- Font Awesome for iconography
- Google Fonts (Inter) for typography

### Development Tools
- Replit-specific plugins for development environment integration
- Runtime error overlay for debugging
- Cartographer for development insights

### Database and ORM
- Drizzle ORM for type-safe database operations
- Neon Database for serverless PostgreSQL hosting
- Drizzle Zod for schema validation

### State Management and API
- TanStack Query for efficient server state management
- Custom query client with error handling and caching strategies

## Deployment Strategy

### Development Environment
- Replit-hosted with hot module replacement
- PostgreSQL 16 module for local database development
- Port 5000 for local development server

### Production Deployment
- Autoscale deployment target on Replit infrastructure
- Optimized builds using Vite for client and ESBuild for server
- Environment-based configuration management
- Static asset serving from dist/public directory

### Database Management
- Environment-based DATABASE_URL configuration
- Drizzle migrations stored in ./migrations directory
- Schema definitions in shared directory for type consistency

## Changelog

- June 15, 2025. Initial setup
- June 15, 2025. Added PostgreSQL database with Drizzle ORM, replaced in-memory storage with DatabaseStorage, populated with 20 furniture products across 6 categories
- June 16, 2025. Fixed cart functionality and React state management warnings, resolved checkout navigation issues
- June 16, 2025. Added NIN (National Identification Number) field to checkout form alongside BVN for enhanced Nigerian market compliance
- June 17, 2025. Implemented enhanced rent-to-own model with 1% monthly rental fees, insurance option (2% of item value), and backend configuration system for easy payment adjustments
- June 17, 2025. Added dedicated terms and conditions page (/terms) with installment payment details, implemented 2-6 month payment plans with 5% monthly service fees, added buy/installment purchase options with terms agreement requirement
- June 17, 2025. Created comprehensive category system with dedicated category pages (/category/:category), updated home page with 8 functional categories (Living Room, Bedroom, Dining Room, Office, Lighting, Decor, Storage, View All), implemented enhanced sorting options in explore page (Name A-Z/Z-A, Price Low/High), added expanded price range filters (Under ₦50k, ₦50k-100k, ₦100k-200k, Above ₦200k)
- June 17, 2025. Added smooth hover animations to all category box images with scale-105 effects and smooth transitions, created comprehensive support section with Help Center (/help), Returns (/returns), and Contact Us (/contact) pages, removed delivery info from footer navigation

## User Preferences

Preferred communication style: Simple, everyday language.