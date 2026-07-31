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

export type ScalingMove = {
  id: string
  name: string
  what: string
  /** True for statelessness, which is not a peer move but what makes scale-out possible. */
  precondition?: boolean
  /** The part that is not in the name, and that costs someone an afternoon. */
  catch?: string
}

/**
 * Source: docs/03-architecture.md, "The shapes a system can take" and "Start
 * with one application".
 *
 * Statelessness leads and is marked rather than listed, because the doc is
 * explicit that it decides whether the deployment table is available to you at
 * all: an in-memory session cache works perfectly on one machine and breaks the
 * moment there are two.
 *
 * Pooling is here rather than with the deployment styles because it is the edge
 * a reader following this playbook meets first, and it is the one that fails on
 * connect rather than in anything they wrote.
 */
export const SCALING_MOVES: ScalingMove[] = [
  {
    id: 'stateless',
    name: 'Statelessness',
    precondition: true,
    what: 'The application keeps no request state in its own memory — sessions live in a cookie, a table or a shared store, never a local variable. Any instance can then serve any request, which is what lets you run several copies at all, and what makes the serverless row possible, since the platform starts and stops instances whenever it likes.',
    catch:
      'An in-memory session cache works perfectly on one machine and breaks the moment there are two. It is a property you either have or do not, and it is decided now.',
  },
  {
    id: 'scale-up',
    name: 'Vertical scaling',
    what: 'A bigger machine. Simpler, needs no statelessness, and eventually runs out of machine.',
    catch:
      'Vertical first is almost always right. The point of knowing the difference is that the other one is not something you bolt on later.',
  },
  {
    id: 'scale-out',
    name: 'Horizontal scaling',
    what: 'More machines behind a load balancer. Effectively no ceiling.',
    catch:
      'Needs statelessness first, which is why that is the precondition above rather than a fourth option here.',
  },
  {
    id: 'load-balancer',
    name: 'A load balancer',
    what: 'The thing in front of several instances that decides which one serves a request. It is what horizontal scaling is made of rather than a separate decision.',
  },
  {
    id: 'read-replicas',
    name: 'Read replicas',
    what: 'Copies that spread read load. They do nothing for writes, because writes still go to one place.',
    catch:
      'A replica is behind by some amount. That lag is where the eventual consistency from the concurrency step turns up in your own product rather than in theory — a user saves, gets redirected, reads from a replica, and does not see their own change.',
  },
  {
    id: 'pooling',
    name: 'A connection pooler',
    what: 'A Postgres instance accepts a limited number of simultaneous connections — often a couple of hundred, fewer on small plans. Serverless functions scale by starting more instances and each instance wants its own connection, so moderate-looking traffic exhausts the limit and new requests fail on connect rather than on anything you wrote. A pooler holds a small number of real connections and multiplexes everyone onto them. Managed providers ship one, and reaching for it is usually a connection-string change rather than an architecture change.',
    catch:
      'A pooler in transaction mode hands your connection to someone else between statements, which breaks anything relying on session state — prepared statements, session variables, advisory locks, and the SELECT … FOR UPDATE this stage teaches. Most clients have a flag for it. Read your provider’s note on the mode before assuming it is invisible.',
  },
]
