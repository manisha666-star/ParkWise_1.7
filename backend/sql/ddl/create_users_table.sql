-- Create users table if it doesn't exist
create table if not exists users (
  id uuid primary key,
  email text unique not null,
  subscription text default 'free',
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table users enable row level security;

-- Enable UUID generation extension
create extension if not exists "pgcrypto";

-- Set default UUID generation for the id column
alter table users
alter column id set default gen_random_uuid();
