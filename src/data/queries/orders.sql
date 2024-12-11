/*
 @name InsertOrder
 @param order -> (id!, workspaceId!, status!)
*/
INSERT INTO orders (id, workspace_id, status)
VALUES :order
RETURNING *;

/*
 @name UpdateOrderStatus
*/
UPDATE orders
SET status = :status!
WHERE id = :orderId!
RETURNING *;
