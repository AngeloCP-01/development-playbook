/**
 * Source: docs/03-architecture.md, "The shapes a system can take".
 *
 * Two questions that usually get collapsed into one, kept apart here because
 * collapsing them is what makes "monolith or microservices" a bad question:
 * how the system deploys, and how it is organised inside. A hexagonal monolith
 * is an ordinary, sensible thing.
 */

export type DeploymentStyle = {
  id: string
  name: string
  /** One line, shown collapsed. */
  summary: string
  buys: string
  costs: string
  /** The condition under which this shape is the right answer. */
  trueWhen: string
}

export const DEPLOYMENT_STYLES: DeploymentStyle[] = [
  {
    id: 'monolith',
    name: 'Monolith',
    summary: 'One process, one deploy.',
    buys: 'One process and one deploy. Refactoring across the whole system is a rename, and there is one place to look when it breaks.',
    costs:
      'Everything scales together, and one bad deploy takes all of it down at once.',
    trueWhen: 'Almost anything, starting out.',
  },
  {
    id: 'modular-monolith',
    name: 'Modular monolith',
    summary: 'The above, plus seams that make a later split mechanical.',
    buys: 'Everything the monolith buys, plus boundaries that make extracting a service later a mechanical job rather than an archaeology project.',
    costs:
      'The boundaries hold by discipline. Nothing at runtime enforces them, so the rule is only as good as the last time somebody was in a hurry.',
    trueWhen:
      'You expect the system to outlive your first guess at its shape, which is most systems anyone keeps.',
  },
  {
    id: 'microservices',
    name: 'Microservices',
    summary: 'Independent deploys, for teams that need them.',
    buys: 'Independent deploys, independent scaling, and team autonomy. Read that list again: every item on it is organisational. Independent deploys matter when the alternative is four teams negotiating a release. Alone, you are negotiating with yourself, and you will win.',
    costs:
      'Network failure modes, distributed debugging, and consistency across separate stores. These are technical, and they arrive on day one.',
    trueWhen:
      'Separate teams need to ship without coordinating with each other.',
  },
  {
    id: 'serverless',
    name: 'Serverless',
    summary: 'No servers to keep alive; scales to zero.',
    buys: 'Nothing to keep alive, scaling to zero, and a bill that tracks invocations rather than uptime.',
    costs:
      'Cold starts, execution limits, and anything that does not fit the shape of a request and a response.',
    trueWhen:
      'Load is spiky or close to zero, and the work fits inside the limits.',
  },
]

/** What this stage teaches, and it is worth having the name. */
export const CHOSEN_STYLE_ID = 'modular-monolith'

export type OrganisationStyle = {
  id: string
  name: string
  summary: string
  body: string
}

/**
 * Independent of the deployment shape above: both are compatible with every
 * row of it. This is the axis the stage's own advice lives on, which is why
 * the next two sections are about structure inside one application.
 */
export const ORGANISATION_STYLES: OrganisationStyle[] = [
  {
    id: 'layered',
    name: 'Layered',
    summary: 'Routes call services call repositories.',
    body: 'Familiar and easy to explain, which is worth more than it sounds. Its failure mode is a bottom layer that everything reaches through, at which point the layers describe the imports rather than the design. Start here, and extract ports where a piece of logic gets hard to test.',
  },
  {
    id: 'hexagonal',
    name: 'Hexagonal (ports and adapters)',
    summary: 'The domain defines interfaces; everything else plugs in.',
    body: 'The domain logic defines the interfaces, and the database, HTTP and third parties plug into them. More indirection, and the payoff is a core you can test without any of them running. If your logic is mostly validate, write, read back, this is ceremony around a thin middle.',
  },
]

/**
 * The doc decides between them on exactly this, rather than on taste. Going
 * from layered to hexagonal is an extraction; going the other way is a rewrite.
 */
export const ORGANISATION_QUESTION =
  'How much of your logic is worth testing without the database running?'

export type StyleTrace = {
  characteristicId: string
  /** What that characteristic rules in or out, and why. */
  rules: string
}

/**
 * The choice follows from the characteristics, not from taste. Run the same
 * trace against your own three: if it produces a different answer than the next
 * section, the next section is wrong for your system, and you should be able to
 * say why.
 */
export const STYLE_TRACE: StyleTrace[] = [
  {
    characteristicId: 'cheap-to-run',
    rules:
      'Rules out microservices, whose costs are paid per service regardless of load, and makes serverless a deployment detail rather than an architecture.',
  },
  {
    characteristicId: 'correctness',
    rules:
      'Favours one database with real constraints over consistency maintained by hand across several.',
  },
  {
    characteristicId: 'auditability',
    rules:
      'Is easier where every write goes through one place, which is an argument for the boundaries in the next section rather than against them.',
  },
]
