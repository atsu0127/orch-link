# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Orch Link is an orchestra extra communication portal application designed to facilitate information sharing for orchestra extras. This is a Next.js application that will be deployed on Google Cloud Platform (GCP) using Kubernetes.

## Architecture

### Technology Stack

- **Frontend**: Next.js with App Router
- **Styling**: Tailwind CSS (mobile-responsive)
- **Database**: PostgreSQL (Cloud SQL on GCP)
- **Authentication**: JWT-based auth with dual approach:
  - Administrators: Auth0 or similar external auth
  - Extras (viewers): Shared password login
- **Infrastructure**: GCP (GKE Autopilot, Cloud SQL, Secret Manager)
- **Deployment**: Docker + Kubernetes
- **Infrastructure as Code**: Terraform

### System Architecture

The application follows a cloud-native architecture:

- Next.js app runs on GKE Autopilot
- API routes handle JWT validation and database connections
- PostgreSQL database on Cloud SQL
- Secrets managed via GCP Secret Manager
- Email notifications via Resend or SendGrid
- Automated link checking via Kubernetes CronJobs

## Key Features

### User Types

- **Administrators**: Full CRUD access to concert information
- **Extras (Viewers)**: Read-only access to information, attendance form submission

### Core Functionality

1. **Concert Management**: Multiple concerts with selective viewing
2. **Attendance Forms**: Links to external forms (any URL - Google Forms, Microsoft Forms, or custom solutions)
3. **Sheet Music Links**: PDF links with update history and automated link checking
4. **Practice Schedule**: List and detail views for rehearsal information
5. **Contact Feature**: mailto links to administrators
6. **Session Management**: JWT-based sessions lasting at least 1 day

### Special Requirements

- Mobile-responsive design (primary use case)
- Anonymous access for extras (no personal data collection)
- Automated link validation with email notifications to administrators
- Update history tracking for sheet music changes
- Last accessed concert/tab memory

## Development Phases

The project is planned in 5 phases:

1. **Local Development**: Next.js app with mock data/SQLite
2. **GCP Infrastructure**: Terraform-based cloud setup
3. **Cloud Deployment**: Docker + Kubernetes deployment
4. **Integration Testing**: JWT auth and email notification testing
5. **Production Setup**: Multi-environment configuration

## Project Structure

- `docs/`: Complete project documentation
  - `architecture.md`: System design and GCP service selection
  - `plan.md`: 5-phase development roadmap
  - `requirements.md`: Detailed feature requirements
  - `screen_design.md`: UI/UX specifications
- `README.md`: Basic project description (in Japanese)

## Development Guidelines

### Code Style and Comments

- Write all code comments, function descriptions, and variable names in Japanese
- Use descriptive Japanese comments to explain business logic and complex operations
- Follow consistent naming conventions with meaningful Japanese descriptions

### Authentication Implementation

- Implement dual JWT system for admin vs viewer roles
- Store JWT secrets in GCP Secret Manager
- Use secure cookie or localStorage for session persistence
- Implement role-based access control in API routes

### Database Design

- Design for multi-concert support
- Include update timestamp tracking
- Plan for sheet music link validation status
- Consider soft deletes for audit trails

### Security Considerations

- Never store personal information for extras/viewers
- Use environment variables for all configuration
- Implement proper CORS and security headers
- Validate all inputs on both client and server side

### Mobile-First Design

- Prioritize mobile experience (primary user interface)
- Use Tailwind responsive utilities
- Test on various mobile screen sizes
- Implement touch-friendly interactions

## Common Commands

Note: This project appears to be in early planning stages. Build and development commands will be added once the Next.js application is scaffolded.

Expected commands for future development:

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run test` - Run tests
- `npm run lint` - Code linting

## Infrastructure Notes

- All infrastructure should be provisioned via Terraform
- Use GCP service accounts for authentication
- Implement proper secret management via Secret Manager
- Plan for staging and production environments
- Configure monitoring and logging via Cloud Logging
