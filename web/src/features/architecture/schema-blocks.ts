/**
 * Source: docs/03-architecture.md, "Design the database".
 *
 * The three SQL blocks the schema step shows beyond the invoices table, plus
 * the ER view that precedes all of them. Each block is an excerpt and assumes
 * the tables the domain model named already exist — they are not a migration
 * file, which is what the step says out loud.
 */

import { type SchemaLine } from './scoring'

/**
 * The other half of the auditability trace row. A `status` of `sent` records
 * that an invoice was sent; it does not record when, to which address, or that
 * it was sent twice. Those are facts about moments, which the interrogation
 * says to store — so they get a table of their own, appended to and never
 * updated.
 */
export const INVOICE_SENDS_LINES: SchemaLine[] = [
  { id: 'sends-open', sql: 'CREATE TABLE invoice_sends (', indent: 0 },
  {
    id: 'sends-id',
    sql: 'id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),',
    indent: 1,
  },
  {
    id: 'sends-invoice',
    sql: 'invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE RESTRICT,',
    indent: 1,
    note: 'RESTRICT again, for the reason it appears on invoices: a send record that outlives the invoice it describes answers nothing, and one that vanishes with it defeats the point of keeping it.',
  },
  {
    id: 'sends-to',
    sql: 'sent_to    text NOT NULL,          -- the address at the time, not a join to the client',
    indent: 1,
    note: 'Stored, not joined, and the comment is the whole lesson. A join to the client reports where the invoice would go today. What auditability needs is where it actually went on the 3rd — which is a fact about a moment, and the client record has since been edited.',
  },
  {
    id: 'sends-at',
    sql: 'sent_at    timestamptz NOT NULL DEFAULT now()',
    indent: 1,
    note: 'Append-only is the point: rows go in, nothing edits them, and “we sent it on the 3rd to the old address” stops being a reconstruction. Note what this is not — it is not event sourcing. The invoice’s current state still lives on invoices, and this table sits beside it rather than being the source it is derived from. That distinction is the one people talk themselves out of.',
  },
  { id: 'sends-close', sql: ');', indent: 0 },
]

/**
 * Indexes answer queries you actually run, so write the queries first. Both of
 * these come from the system sketch rather than from intuition: one from a
 * screen, one from the scheduled job.
 */
export const INDEX_LINES: SchemaLine[] = [
  {
    id: 'dashboard-comment',
    sql: "-- The dashboard lists one user's invoices, filtered by status.",
    indent: 0,
  },
  {
    id: 'dashboard-index',
    sql: 'CREATE INDEX invoices_owner_status_idx ON invoices (owner_id, status);',
    indent: 0,
    note: 'Traced to a screen. Without it every page load scans the whole table. The column order matters: owner_id first, because that is the column every query filters on and status only narrows what is left.',
  },
  { id: 'gap', sql: '', indent: 0 },
  {
    id: 'overdue-comment',
    sql: '-- The scheduled job looks for sent invoices past their due date.',
    indent: 0,
  },
  {
    id: 'overdue-index',
    sql: "CREATE INDEX invoices_overdue_idx ON invoices (due_date) WHERE status = 'sent';",
    indent: 0,
    note: 'Traced to the scheduled job in the sketch. Partial, because the job never asks about drafts or paid invoices, and a smaller index is a faster one. Indexes cost write time and disk, which is why “index everything” is not the answer and “index nothing until it hurts” is not either.',
  },
]

/**
 * Some rules are conditional, and UNIQUE cannot express them. The stage names
 * races as the reason constraints belong in the database, then supplies only
 * primary keys, foreign keys, CHECK and UNIQUE — none of which can say "at most
 * one approved claim per shift".
 */
export const PARTIAL_UNIQUE_LINES: SchemaLine[] = [
  {
    id: 'create',
    sql: 'CREATE UNIQUE INDEX one_approved_claim_per_shift',
    indent: 0,
    note: 'A unique index rather than a UNIQUE constraint, because only an index can carry the WHERE clause below. A plain UNIQUE (shift_id) would also forbid the second rejected claim, which is wrong.',
  },
  {
    id: 'where',
    sql: "  ON claims (shift_id) WHERE status = 'approved';",
    indent: 1,
    note: 'The condition is what makes the rule expressible. Without it, the usual approach is to check for an existing approval and then insert — which two concurrent requests both pass, both believing they were first. That is the race the database was supposed to be holding the line on.',
  },
]

/**
 * Actors and tenancy are stored data too, and they are the two this stage most
 * often leaves implicit. The invoicing schema has neither, because one
 * freelancer owning their own rows needs neither. Most products are not that.
 */
export const TENANCY_LINES: SchemaLine[] = [
  { id: 'companies-open', sql: 'CREATE TABLE companies (', indent: 0 },
  {
    id: 'companies-id',
    sql: '  id   uuid PRIMARY KEY DEFAULT gen_random_uuid(),',
    indent: 1,
  },
  { id: 'companies-name', sql: '  name text NOT NULL', indent: 1 },
  { id: 'companies-close', sql: ');', indent: 0 },
  { id: 'gap-1', sql: '', indent: 0 },
  { id: 'teams-open', sql: 'CREATE TABLE teams (', indent: 0 },
  {
    id: 'teams-id',
    sql: '  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),',
    indent: 1,
  },
  {
    id: 'teams-company',
    sql: '  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE RESTRICT,',
    indent: 1,
    note: 'The tenant key, and the one item on the deferral list that cannot be deferred. It is stored data on every table that holds tenant data, which the top of this stage classifies as decide-now.',
  },
  { id: 'teams-name', sql: '  name       text NOT NULL,', indent: 1 },
  {
    id: 'teams-unique',
    sql: '  UNIQUE (company_id, name)',
    indent: 1,
    note: 'The scoped-uniqueness rule from the domain model, applied to a tenant: two companies may both have a team called Kitchen. Globally unique team names would fail the second company for no reason its users could understand.',
  },
  { id: 'teams-close', sql: ');', indent: 0 },
  { id: 'gap-2', sql: '', indent: 0 },
  { id: 'memberships-open', sql: 'CREATE TABLE memberships (', indent: 0 },
  {
    id: 'memberships-user',
    sql: '  user_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,',
    indent: 1,
  },
  {
    id: 'memberships-team',
    sql: '  team_id uuid NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,',
    indent: 1,
  },
  {
    id: 'memberships-role',
    sql: "  role    text NOT NULL CHECK (role IN ('member','manager')),",
    indent: 1,
    note: 'The role lives on the relationship, not on the user. A person can manage one team and be an ordinary member of another, and a users.role column cannot say that. This is the answer to the actor-rights interrogation question, which is why that question is asked before the schema exists.',
  },
  {
    id: 'memberships-pk',
    sql: '  PRIMARY KEY (user_id, team_id)',
    indent: 1,
    note: 'The pair is the identity: one row per person per team. It also makes the membership lookup — the query behind the membership authorization pattern — an index hit rather than a scan.',
  },
  { id: 'memberships-close', sql: ');', indent: 0 },
]

export type ErEdge = {
  id: string
  from: string
  to: string
  /** Present where the edge is a decision rather than an obvious consequence. */
  note?: string
}

export const ER_ENTITIES: string[] = [
  'users',
  'clients',
  'invoices',
  'line_items',
]

/**
 * The same picture the domain model described in words, with cardinality made
 * explicit. Worth drawing once, because the fourth edge is visible here and
 * invisible in a list of tables.
 */
export const ER_EDGES: ErEdge[] = [
  { id: 'users-clients', from: 'users', to: 'clients' },
  { id: 'clients-invoices', from: 'clients', to: 'invoices' },
  { id: 'invoices-line-items', from: 'invoices', to: 'line_items' },
  {
    id: 'users-invoices',
    from: 'users',
    to: 'invoices',
    note: 'Worth arguing about before it is typed. Hanging invoices off users as well as clients is what lets a client be merged or reassigned later without the invoices following it. It is exactly the kind of thing an ER view makes visible and a list of tables does not.',
  },
]
