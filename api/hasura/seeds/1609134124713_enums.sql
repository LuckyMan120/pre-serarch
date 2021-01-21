INSERT INTO
  public.event_type (value, comment)
VALUES
  ('EXPERIMENT_CREATED', NULL),
  ('EXPERIMENT_RENAMED', NULL),
  ('EXPERIMENT_STATUS_CHANGED', NULL),
  ('EXPERIMENT_DELETED', NULL),
  ('EXPERIMENT_EXPORTED', NULL),
  ('NOTE_ADDED', NULL),
  ('NOTE_DELETED', NULL);

INSERT INTO
  public.experiment_status (value, comment)
VALUES 
  ('COMPLETED', ''),
  ('IN_PROGRESS', ''),
  ('BLOCKED', '');
