/**
 * Source: docs/03-architecture.md, "Design the database" — its Normalisation
 * subsection.
 *
 * The doc leads with the working rule and named the forms in a single clause.
 * These carry the definitions, because a reader meets the names in every schema
 * discussion they will ever have, and "named, not taught" is the gap D-49
 * exists to close.
 *
 * Each violation is stated against this stage's own invoicing example rather
 * than in the abstract — a definition matched against a schema the reader has
 * never seen teaches the words and not the test.
 */

export type NormalForm = {
  id: '1nf' | '2nf' | '3nf'
  name: string
  rule: string
  /** The shape of the mistake it forbids, in this stage's own example. */
  violation: string
  /** Where this stage breaks the form on purpose, for forms that it does. */
  exception?: string
}

export const NORMAL_FORMS: NormalForm[] = [
  {
    id: '1nf',
    name: 'First normal form',
    rule: 'One value per cell — no lists, no comma-separated anything.',
    violation:
      'A comma-separated list of tags in a tags column on the invoice. It looks harmless until you have to query it, and then every query is a string operation against data that was never text.',
  },
  {
    id: '2nf',
    name: 'Second normal form',
    rule: 'No column depending on only part of a composite key.',
    violation:
      'On a table keyed by (invoice_id, line_no), storing the client’s name — it depends on the invoice alone, so half the key is carrying it and the other half is along for the ride.',
  },
  {
    id: '3nf',
    name: 'Third normal form',
    rule: 'No column depending on another non-key column. This is the one worth aiming at.',
    violation:
      'Storing both client_id and the client’s current address on an invoice. It is the violation the working rule above is really about: change the address and you are updating two rows, and the day you update one is the day they disagree.',
    exception:
      'Two violations in this stage are deliberate, and both are worth knowing before you "fix" them. A fact about a moment — the address it went to, the price at the time — belongs on the row that records the moment rather than on the aggregate, which is why sent_to sits on invoice_sends and not on invoices. And the tenant key is carried on every table that holds tenant data, which on a hierarchy deeper than one level breaks third normal form on purpose, once per level below the first: a query that must join four tables to prove a row is yours is one that will eventually forget to, and forgetting shows one customer another’s data.',
  },
]
