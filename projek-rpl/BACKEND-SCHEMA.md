# Backend Schema Documentation

## Tech Stack
- Backend: Supabase
- Database: PostgreSQL
- Auth: Supabase Auth
- Storage: Supabase Storage
- Realtime: Supabase Realtime

## Roles
- admin
- teacher
- parent

## Tables

### profiles
Stores user profile and role data.

Columns:
- id: uuid, linked to auth.users
- role: admin / teacher / parent
- created_at: timestamp

### children
Stores child data.

Columns:
- id: uuid
- full_name: text
- birth_date: date
- parent_id: references profiles.id
- created_at: timestamp

### daily_logs
Stores daily child activity logs.

Columns:
- id: uuid
- child_id: references children.id
- teacher_id: references profiles.id
- title: text
- description: text
- activity_time: time
- log_date: date
- photo_url: text
- created_at: timestamp

### reports
Stores weekly/monthly child progress reports.

Columns:
- id: uuid
- child_id: references children.id
- teacher_id: references profiles.id
- report_type: weekly / monthly
- content: text
- report_date: date
- created_at: timestamp

### pickup_requests
Stores child pickup confirmation requests.

Columns:
- id: uuid
- child_id: references children.id
- requested_by: references profiles.id
- pickup_person_name: text
- relationship: grandparents / family_member / acquaintance
- status: pending / approved / rejected
- approved_by: references profiles.id
- approved_at: timestamp
- created_at: timestamp

### conversations
Stores chat rooms.

### conversation_members
Stores users inside conversations.

### messages
Stores chat messages.

### message_reads
Stores read receipts for group chat.

## Storage

Bucket:
- foto_daily_log

Purpose:
- store photos attached to daily logs

## Security / RLS Summary

### Parent
- can view own children
- can view own child logs/reports
- can create/edit pending pickup requests

### Teacher
- can view children
- can create daily logs
- can create reports
- can approve pickup requests
- can join assigned conversations

### Admin
- can manage most data