/** Types generated for queries found in "src/data/queries/orders.sql" */
import { PreparedQuery } from '@pgtyped/runtime'

/** 'InsertOrder' parameters type */
export interface IInsertOrderParams {
  order: {
    id: string
    workspaceId: string
    status: string
  }
}

/** 'InsertOrder' return type */
export interface IInsertOrderResult {
  created_at: Date | null
  id: string
  status: string
  workspace_id: string
}

/** 'InsertOrder' query type */
export interface IInsertOrderQuery {
  params: IInsertOrderParams
  result: IInsertOrderResult
}

const insertOrderIR: any = {
  usedParamSet: { order: true },
  params: [
    {
      name: 'order',
      required: false,
      transform: {
        type: 'pick_tuple',
        keys: [
          { name: 'id', required: true },
          { name: 'workspaceId', required: true },
          { name: 'status', required: true },
        ],
      },
      locs: [{ a: 53, b: 58 }],
    },
  ],
  statement:
    'INSERT INTO orders (id, workspace_id, status)\nVALUES :order\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO orders (id, workspace_id, status)
 * VALUES :order
 * RETURNING *
 * ```
 */
export const insertOrder = new PreparedQuery<
  IInsertOrderParams,
  IInsertOrderResult
>(insertOrderIR)

/** 'UpdateOrderStatus' parameters type */
export interface IUpdateOrderStatusParams {
  orderId: string
  status: string
}

/** 'UpdateOrderStatus' return type */
export interface IUpdateOrderStatusResult {
  created_at: Date | null
  id: string
  status: string
  workspace_id: string
}

/** 'UpdateOrderStatus' query type */
export interface IUpdateOrderStatusQuery {
  params: IUpdateOrderStatusParams
  result: IUpdateOrderStatusResult
}

const updateOrderStatusIR: any = {
  usedParamSet: { status: true, orderId: true },
  params: [
    {
      name: 'status',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 27, b: 34 }],
    },
    {
      name: 'orderId',
      required: true,
      transform: { type: 'scalar' },
      locs: [{ a: 47, b: 55 }],
    },
  ],
  statement:
    'UPDATE orders\nSET status = :status!\nWHERE id = :orderId!\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * UPDATE orders
 * SET status = :status!
 * WHERE id = :orderId!
 * RETURNING *
 * ```
 */
export const updateOrderStatus = new PreparedQuery<
  IUpdateOrderStatusParams,
  IUpdateOrderStatusResult
>(updateOrderStatusIR)
