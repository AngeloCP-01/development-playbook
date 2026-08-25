import type { Cheatsheet } from './types'

/**
 * The displayed plate (gathered W-6.2, author unrecorded) covers six patterns
 * in depth with code — Singleton, Factory, Observer, Adapter, Strategy,
 * Decorator — and their `when` rows below are taken from its named use cases.
 * The other seventeen are cross-referenced from two further gathered graphics
 * that are not themselves displayed ("GoF Design Patterns — 23 Timeless
 * Solutions" and GeeksforGeeks' "When to Use Which Design Pattern"; see
 * reference/cheatsheet-sources.md) — a second and third plate would repeat the
 * same three-category structure the first already shows.
 *
 * Twenty-three patterns do not fit one panel of prose, which is why this is a
 * lookup sheet with three sections rather than a stage: nothing here is read
 * start to finish.
 */
export const designPatterns: Cheatsheet = {
  slug: 'design-patterns',
  title: 'Design Patterns',
  group: 'Architecture',
  stage: '03-architecture',
  blurb: 'The Gang of Four set, grouped by what each one is for.',
  source: {
    title: 'Software Design Patterns',
    author: 'Unrecorded — see reference/cheatsheet-sources.md',
    image: {
      src: '/reference/software-design-patterns.webp',
      width: 1536,
      height: 1024,
      alt: 'Six design patterns with code: Singleton, Factory, Observer, Adapter, Strategy, Decorator.',
    },
  },
  sections: [
    {
      title: 'Creational — how objects are created',
      rows: [
        {
          term: 'Singleton',
          what: 'Ensures a class has exactly one instance and one global access point.',
          when: 'Config managers, loggers, caches — cases where a second instance would be a bug, not a feature.',
        },
        {
          term: 'Factory Method',
          what: 'Defines an interface for creating an object, letting subclasses choose the concrete class.',
          when: 'Object creation logic is complex enough that the caller should not have to know it.',
        },
        {
          term: 'Abstract Factory',
          what: 'Creates families of related objects without naming their concrete classes.',
          when: 'A whole family needs to swap together — a UI theme, a database driver set.',
        },
        {
          term: 'Builder',
          what: 'Builds a complex object step by step, separating construction from representation.',
          when: 'Many optional parameters would otherwise mean a constructor nobody can read.',
        },
        {
          term: 'Prototype',
          what: 'Creates new objects by cloning an existing one rather than building from scratch.',
          when: 'A template instance already exists and copying it is cheaper than reconstructing it.',
        },
      ],
    },
    {
      title: 'Structural — how objects are composed',
      rows: [
        {
          term: 'Adapter',
          what: 'Converts the interface of a class into another interface clients expect.',
          when: 'Integrating third-party libraries or legacy systems whose interface you cannot change.',
        },
        {
          term: 'Bridge',
          what: 'Decouples an abstraction from its implementation so both can vary independently.',
          when: 'An abstraction and its implementation would otherwise multiply combinations through subclassing.',
        },
        {
          term: 'Composite',
          what: 'Composes objects into tree structures and treats a single object and a group of them the same way.',
          when: 'Part-whole hierarchies where the caller should not have to check which one it has.',
        },
        {
          term: 'Decorator',
          what: 'Adds behavior to an object dynamically, without touching its class.',
          when: 'Layering concerns like logging, authorization or caching without subclassing for every combination.',
        },
        {
          term: 'Facade',
          what: 'Provides one simplified interface to a complex subsystem.',
          when: 'Simplifying usage for callers who need the common path, not the whole subsystem’s surface.',
        },
        {
          term: 'Flyweight',
          what: 'Shares objects to support large numbers of fine-grained instances efficiently.',
          when: 'Object count is high enough that per-instance memory is the actual bottleneck.',
        },
        {
          term: 'Proxy',
          what: 'Controls access to an object through a surrogate that stands in for it.',
          when: 'Access control, lazy loading, or logging need to sit in front of the real object.',
        },
      ],
    },
    {
      title: 'Behavioral — how objects communicate',
      rows: [
        {
          term: 'Chain of Responsibility',
          what: 'Passes a request along a chain of handlers until one of them handles it.',
          when: 'The sender should not need to know which handler, if any, will act.',
        },
        {
          term: 'Command',
          what: 'Encapsulates a request as an object, decoupling the invoker from the thing that executes it.',
          when: 'Queuing, logging or undoing actions requires treating a request as data.',
        },
        {
          term: 'Interpreter',
          what: 'Defines a grammar and a way to interpret sentences written in it.',
          when: 'A small language recurs often enough to justify its own grammar rather than ad hoc parsing.',
        },
        {
          term: 'Iterator',
          what: 'Traverses a collection’s elements without exposing how the collection is stored.',
          when: 'Callers need to walk a collection without depending on its internal structure.',
        },
        {
          term: 'Mediator',
          what: 'Centralizes communication between objects so they reference the mediator instead of each other.',
          when: 'A group of objects’ interactions have become a tangle of direct references.',
        },
        {
          term: 'Memento',
          what: 'Captures and restores an object’s internal state without exposing that state directly.',
          when: 'Undo functionality needs a snapshot that does not break encapsulation to take.',
        },
        {
          term: 'Observer',
          what: 'Notifies multiple dependents automatically when an object’s state changes.',
          when: 'Event handling, UI updates, notifications — anywhere one change fans out to many reactions.',
        },
        {
          term: 'State',
          what: 'Lets an object alter its behavior when its internal state changes, as if it changed class.',
          when: 'A single object’s behavior branches heavily on a status field that keeps growing.',
        },
        {
          term: 'Strategy',
          what: 'Defines a family of algorithms, encapsulates each one, and makes them interchangeable.',
          when: 'Payment methods, sorting, compression — the algorithm varies but the caller’s shape does not.',
        },
        {
          term: 'Template Method',
          what: 'Defines the skeleton of an algorithm in a base class, letting subclasses override specific steps.',
          when: 'Several variants share most of a process and differ only in a few well-defined steps.',
        },
        {
          term: 'Visitor',
          what: 'Adds new operations to an object structure without modifying the classes it operates on.',
          when: 'New operations arrive more often than new element types do.',
        },
      ],
    },
  ],
}
