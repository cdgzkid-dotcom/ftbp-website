CREATE TABLE IF NOT EXISTS scripts (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  guest_name    text NOT NULL,
  guest_company text,
  episode_number int,
  content       text NOT NULL,
  status        text DEFAULT 'draft',
  share_token   text UNIQUE DEFAULT substr(md5(random()::text), 1, 8),
  created_at    timestamp DEFAULT now(),
  updated_at    timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id   uuid REFERENCES scripts(id) ON DELETE CASCADE,
  section     text,
  content     text NOT NULL,
  author_name text DEFAULT 'Invitado',
  created_at  timestamp DEFAULT now()
);
