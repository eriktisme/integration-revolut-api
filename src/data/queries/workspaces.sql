/*
 @name InsertWorkspace
 @param workspace -> (id!, revolutCustomerId!)
*/
INSERT INTO workspaces (id, revolut_customer_id)
VALUES :workspace
RETURNING *;