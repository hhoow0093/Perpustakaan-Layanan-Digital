# User Dashboard — Full Specification

This document describes the complete requirements and logic for implementing the User Dashboard in the frontend application.

## Dashboard Structure

Sidebar contains:
- Borrow Book
- Borrow Room
- Book Borrowing History
- Room Borrowing History

## Borrow Book Page

### Banner
- Greeting for the user.
- Display total number of books currently borrowed.

### Search & Filter
- Search bar to search books.
- Dropdown to filter by genre.

### Borrowing Logic
To determine if a book can be borrowed:
- Check `PEMINJAMAN_BUKU` table.
- If the book has a record where `tanggal_checkout` **IS NULL**, it means the book is **still borrowed** → user **cannot** borrow.
- If all records for that book have `tanggal_checkout` **NOT NULL**, book is **available**.

Label books as:
- **Available**
- **Unavailable**

## Borrow Room Page

### Banner
- Greeting for the user.
- Show total number of rooms currently booked.

### Search & Dropdown
- Search bar for rooms.
- Dropdown to select:
  - Room
  - Date
  - Time (start)
  - Duration (end)

### Room Availability Logic
To determine if a room can be booked:
- Check `PEMINJAMAN_RUANGAN` table.
- A room is unavailable if another booking:
  - Has the same `Nomor_Induk_Ruangan`
  - On the same `tanggal_peminjaman`
  - And the user’s requested time overlaps with:
    - `jam_masuk`
    - `jam_keluar`

If overlap occurs → user **cannot** book.

## Book Borrowing History Page
- Display all records from `PEMINJAMAN_BUKU` for the logged-in user.

## Room Borrowing History Page
- Display all records from `PEMINJAMAN_RUANGAN` for the logged-in user.

## 6️⃣ References (Important)

All logic must follow the schemas in:

`backend/config/database/query-DDL.sql`

`backend/config/database/query-INSERT-SAMPLE.sql`