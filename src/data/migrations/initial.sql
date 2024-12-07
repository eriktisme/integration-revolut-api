CREATE TABLE workspaces (
  id VARCHAR PRIMARY KEY,
  revolut_customer_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
