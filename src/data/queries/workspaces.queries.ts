/** Types generated for queries found in "src/data/queries/workspaces.sql" */
import { PreparedQuery } from '@pgtyped/runtime'

/** 'InsertWorkspace' parameters type */
export interface IInsertWorkspaceParams {
  workspace: {
    id: string
    revolutCustomerId: string
  }
}

/** 'InsertWorkspace' return type */
export interface IInsertWorkspaceResult {
  created_at: Date | null
  id: string
  revolut_customer_id: string
}

/** 'InsertWorkspace' query type */
export interface IInsertWorkspaceQuery {
  params: IInsertWorkspaceParams
  result: IInsertWorkspaceResult
}

const insertWorkspaceIR: any = {
  usedParamSet: { workspace: true },
  params: [
    {
      name: 'workspace',
      required: false,
      transform: {
        type: 'pick_tuple',
        keys: [
          { name: 'id', required: true },
          { name: 'revolutCustomerId', required: true },
        ],
      },
      locs: [{ a: 56, b: 65 }],
    },
  ],
  statement:
    'INSERT INTO workspaces (id, revolut_customer_id)\nVALUES :workspace\nRETURNING *',
}

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO workspaces (id, revolut_customer_id)
 * VALUES :workspace
 * RETURNING *
 * ```
 */
export const insertWorkspace = new PreparedQuery<
  IInsertWorkspaceParams,
  IInsertWorkspaceResult
>(insertWorkspaceIR)

/** 'GetWorkspaceById' parameters type */
export interface IGetWorkspaceByIdParams {
  id?: string | null | void
}

/** 'GetWorkspaceById' return type */
export interface IGetWorkspaceByIdResult {
  created_at: Date | null
  id: string
  revolut_customer_id: string
}

/** 'GetWorkspaceById' query type */
export interface IGetWorkspaceByIdQuery {
  params: IGetWorkspaceByIdParams
  result: IGetWorkspaceByIdResult
}

const getWorkspaceByIdIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 37, b: 39 }],
    },
  ],
  statement: 'SELECT\n *\nFROM workspaces\nWHERE id = :id',
}

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *  *
 * FROM workspaces
 * WHERE id = :id
 * ```
 */
export const getWorkspaceById = new PreparedQuery<
  IGetWorkspaceByIdParams,
  IGetWorkspaceByIdResult
>(getWorkspaceByIdIR)
