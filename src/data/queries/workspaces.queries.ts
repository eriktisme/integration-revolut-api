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
