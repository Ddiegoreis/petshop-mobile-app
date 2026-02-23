# Petshop Mobile App - Product Requirements Document (PRD)

## 1. Introduction
This document outlines the requirements for a mobile application designed to manage a Petshop's daily operations. The app will handle client/pet registration, appointment scheduling, and monthly payment tracking.

## 2. Problem Statement
Managing pet information, appointments, and payments manually (paper/spreadsheets) is inefficient and prone to errors. A dedicated mobile app will streamline these processes.

## 3. Goals
- Centralize customer and pet data.
- Simplify appointment scheduling.
- Track monthly payments and identify overdue accounts.
- Provide a clean, modern user interface.

## 4. User Personas
- **Shop Manager/Owner**: Needs full access to manage clients, pets, schedule, and finances.
- **Staff (Optional/Future)**: May need access to view schedule.

## 5. Functional Requirements

### 5.1. Customer & Pet Management (CRUD)
- **Owners**:
  - Register new owners (Name*, Phone*, Address*).
  - Edit/Delete owner details.
  - List all owners with search capability.
- **Pets**:
  - Register new pets linked to an Owner (Name, Breed, Age, Notes).
  - Edit/Delete pet details.
  - View pet history (past appointments).

### 5.2. Agenda / Scheduling
- **Appointments**:
  - Create new appointment (Date, Time, Pet, Service Type, Notes).
  - **Validation**: Prevent scheduling if the pet already has an appointment at the same date and time, displaying a user-friendly message.
  - **Recurrence**: Support creating recurring appointments (Weekly, Bi-weekly, Monthly).
  - **Calendar Sync**: Option to synchronize appointments with the device's native calendar.
  - View daily/weekly schedule.
  - Edit/Cancel appointments (support for single instance or series in future).
  - Status tracking (Scheduled, Completed, Cancelled).

### 5.3. Financial Control
- **Monthly Payments**:
  - Track monthly fees for recurring clients (e.g., daycare/walking packages).
  - Record individual service payments.
  - Dashboard for overdue payments.
  - Payment history per client.

### 5.4. Backup & Restore
- **Manual Backup (Export)**:
  - Export all database tables as a JSON file.
  - Use the device's native share sheet (Google Drive, WhatsApp, etc.) to save/send the backup.
  - Clean up temporary backup files after sharing.
- **Manual Restore (Import)**:
  - Select a previously exported JSON backup file.
  - Validate structure and table compatibility before restoring.
  - Replace all current data with the backup data inside a database transaction (rollback on error).
  - Display confirmation dialog before overwriting data.
  - Show clear success/error messages.

## 6. Non-Functional Requirements
- **Platform**: iOS and Android (via Expo).
- **Performance**: Fast load times, smooth transitions.
- **Data Persistence**: Robust local database (SQLite) with potential for cloud sync.
- **UI/UX**: Modern, intuitive interface with "premium" feel (as per guidelines).

## 7. Future Scope
- Push notifications for appointment reminders.
- Cloud synchronization.
- Client-facing app for owners to book appointments directly.
