import type { Cheatsheet } from './types'

/**
 * Transcribed from the graphic credited to Sathish Kumar Subramani, held at
 * reference/Software-Architecture-Patterns.gif. The six diagrams are not here
 * yet — this slice carries the text; figures arrive with the figure registry.
 */
export const architecturePatterns: Cheatsheet = {
  slug: 'architecture-patterns',
  title: 'Software Architecture Patterns',
  group: 'Architecture',
  stage: '03-architecture',
  blurb: 'Six ways to arrange a system, and what each one costs you.',
  source: {
    title: 'Software Architecture Patterns',
    author: 'Sathish Kumar Subramani',
  },
  sections: [
    {
      title: 'Event-driven',
      note: 'Components communicate through events.',
      rows: [
        {
          term: 'Event producer',
          what: 'Emits events without knowing who consumes them.',
          when: 'The producer must not care how many consumers exist.',
        },
        {
          term: 'Event broker',
          what: 'Holds the ordered stream — event 1 through event N.',
          when: 'Consumers read at their own pace, or replay from the start.',
        },
        {
          term: 'Event consumers',
          what: 'Independent subscribers, each reacting to what it cares about.',
          when: 'Adding a consumer should not require touching the producer.',
        },
      ],
    },
    {
      title: 'Layered',
      note: 'Organize system into layers with separation of concerns.',
      rows: [
        {
          term: 'Presentation layer',
          what: 'What the user touches.',
          when: 'Depends downward only.',
        },
        {
          term: 'Business / application layer',
          what: 'The rules that make this system this system.',
          when: 'The layer worth protecting from the other three.',
        },
        {
          term: 'Data access layer',
          what: 'How persistence is reached, not where it lives.',
          when: 'Swapping the store should stop here.',
        },
        {
          term: 'Persistence layer',
          what: 'The store itself.',
          when: 'The bottom of the stack.',
        },
        {
          term: 'Infrastructure',
          what: 'Cross-cutting concerns every layer talks to.',
          when: 'Logging, config, auth — the things that refuse to layer.',
        },
      ],
    },
    {
      title: 'Monolithic',
      note: 'All components built and deployed as a single unit.',
      rows: [
        {
          term: 'One deployable',
          what: 'Posts, comments, groups, media and live streaming ship together.',
          when: 'One team, one release cadence, no distributed-systems tax.',
        },
        {
          term: 'One database',
          what: 'Every feature reads and writes the same store.',
          when: 'Transactions across features stay trivial.',
        },
        {
          term: 'The cost',
          what: 'Any change redeploys everything.',
          when: 'It bites when teams outgrow one release train.',
        },
      ],
    },
    {
      title: 'Microservices',
      note: 'Application is composed of small, independent services.',
      rows: [
        {
          term: 'API gateway',
          what: 'One entry point in front of many services.',
          when: 'Clients should not know the service topology.',
        },
        {
          term: 'Service per capability',
          what: 'Catalog, cart, discount and order each deploy alone.',
          when: 'Teams need independent release cadence.',
        },
        {
          term: 'Database per service',
          what: 'Each service owns its own store — four services, four databases.',
          when: 'Shared tables reintroduce the coupling the split was meant to remove.',
        },
      ],
    },
    {
      title: 'MVC',
      note: 'Separate application into Model, View and Controller.',
      rows: [
        {
          term: 'View',
          what: 'Renders state and forwards user actions to the controller.',
          when: 'Holds no rules of its own.',
        },
        {
          term: 'Controller',
          what: 'Receives the action, requests data, renders the view.',
          when: 'The traffic director, not the brain.',
        },
        {
          term: 'Model',
          what: 'Fetches and returns data, and updates the controller.',
          when: 'Where the rules and the persistence live.',
        },
      ],
    },
    {
      title: 'Master-slave',
      note: 'Distribute read/write workload between master and slaves.',
      rows: [
        {
          term: 'Master (primary)',
          what: 'Takes every write.',
          when: 'One writer keeps ordering simple.',
        },
        {
          term: 'Slave (replica)',
          what: 'Serves reads, fed by replication from the master.',
          when: 'Read volume is the bottleneck, not write volume.',
        },
        {
          term: 'Replication lag',
          what: 'A replica can answer with data the master already changed.',
          when: 'The trade this pattern asks you to accept.',
        },
      ],
    },
  ],
}
