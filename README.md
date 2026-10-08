# Solliber Micro-Kernel Framework

A minimal, modular Node.js micro-kernel framework designed to provide a
small and extensible foundation for building larger framework layers.

## Status

Version: 0.1.0

This project currently establishes the kernel foundation.

The framework is intentionally small. Features are added as independent
layers rather than being placed into the kernel prematurely.

## Runtime

- Node.js 26.10.0
- npm
- ECMAScript Modules

Node.js version is pinned through `.nvmrc`.

## Frontend

- EJS 7.0.1
- Bootstrap 5.3.8

The frontend stack belongs to the application/web layer and is not part
of the kernel itself.

## Development Storage

Development storage will use JSON.

Production database support is intentionally deferred until a later
framework layer.

## Architecture

The framework follows a micro-kernel architecture.

The kernel provides only the mechanisms required to initialize and
coordinate framework components.

Core responsibilities include:

- Application lifecycle
- Dependency container
- Configuration
- Event dispatching
- Module registration
- Plugin registration

The kernel does not contain authentication, authorization, administration
UI, user UI, or application-specific business logic.

## Planned Layering

The framework is developed incrementally:

1. Kernel
2. Developer UI and development plugins
3. Authentication
4. Users, roles, and permissions
5. Admin UI
6. User UI
7. Demo module
8. First production module

Development plugins may be disabled when they are no longer required.

## Development

Install dependencies:

    npm install

Start the development server:

    npm run dev

Start normally:

    npm start

The default development server listens on:

    http://127.0.0.1:3000

## Validation

Run linting:

    npm run lint

Run formatting validation:

    npm run format:check

Run tests:

    npm test

Run the build validation:

    npm run build

Run the dependency security audit:

    npm run audit

Run all local validation steps:

    npm run lint
    npm run format:check
    npm test
    npm run build
    npm run audit

## Environment

Copy `.env.example` to `.env`.

Available variables:

- `NODE_ENV`
- `HOST`
- `PORT`

Never commit `.env`.

## Project Structure

    src/
    ├── application/
    ├── kernel/
    ├── module/
    ├── plugin/
    ├── storage/
    ├── web/
    └── index.js

    tests/
    scripts/
    views/

The kernel is isolated from application-level concerns.

## Design Principles

### Minimal Kernel

The kernel should remain small.

A feature belongs in the kernel only when other framework components
cannot function correctly without the capability.

### Modular Architecture

Modules provide application or framework features.

Plugins extend or modify framework behavior.

Neither should require changes to unrelated kernel components.

### Dependency Injection

Core services are registered in the dependency container and accessed
through dependency injection rather than global state.

### Lifecycle

Framework components participate in an explicit lifecycle.

The intended lifecycle is:

    created
        ↓
    configured
        ↓
    registered
        ↓
    booted
        ↓
    started
        ↓
    stopped
        ↓
    destroyed

### Events

The kernel exposes an asynchronous event system so modules and plugins
can respond to framework lifecycle events without tightly coupling
themselves to the kernel implementation.

## Security

Security requirements are enforced incrementally as framework layers
are introduced.

Current foundation requirements include:

- No secrets in source code
- Environment-based configuration
- EJS escaped output by default
- Restricted static asset paths
- Dependency auditing
- Input validation at application boundaries

Authentication, authorization, CSRF protection, secure sessions,
rate limiting, and file-upload hardening will be implemented in the
appropriate framework layers rather than embedded prematurely in the
kernel.

## Production Database

The production database abstraction is intentionally deferred.

The future database layer will provide:

- Database abstraction
- Configuration
- Migrations
- Migration rollback
- Environment separation
- Connection lifecycle management

Potential production database engines will be evaluated when that
layer is introduced.

## Testing

Vitest is used for framework testing.

Critical kernel behavior is tested independently of the HTTP layer.

Tests will cover:

- Container behavior
- Configuration
- Events
- Lifecycle transitions
- Module registration
- Plugin registration
- Application startup
- Application shutdown
- Validation behavior

## CI

Continuous integration will validate:

1. Dependency installation
2. Linting
3. Formatting
4. Tests
5. Build validation
6. Dependency security audit

## License

MIT
