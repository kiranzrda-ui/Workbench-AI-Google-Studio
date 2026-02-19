CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY,
  name varchar(120) NOT NULL,
  owner varchar(120) NOT NULL,
  monitoring_status varchar(32) NOT NULL,
  created_at_utc timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS approval_requests (
  id uuid PRIMARY KEY,
  model_id uuid NOT NULL,
  requester varchar(120) NOT NULL,
  status varchar(40) NOT NULL,
  requested_at_utc timestamp with time zone NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_models_name ON models(name);
CREATE INDEX IF NOT EXISTS ix_approval_model_status ON approval_requests(model_id, status);
