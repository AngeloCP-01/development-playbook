import { describe, expect, test } from 'vitest'
import { AWS_VERIFICATION } from './aws-verification'

describe('AWS verification artifact data', () => {
  test('language is bash', () => {
    expect(AWS_VERIFICATION.language).toBe('bash')
  })

  test('has id and filename', () => {
    expect(AWS_VERIFICATION.id).toBeTruthy()
    expect(AWS_VERIFICATION.filename).toBeTruthy()
  })

  test('contains wait services-stable command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('aws ecs wait services-stable')
  })

  test('contains describe-services command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('aws ecs describe-services')
  })

  test('contains describe-target-health command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('describe-target-health')
  })

  test('contains logs tail command', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    expect(text).toContain('aws logs tail')
  })

  test('at least six annotated lines', () => {
    const annotated = AWS_VERIFICATION.lines.filter((l) => l.note)
    expect(annotated.length).toBeGreaterThanOrEqual(6)
  })

  test('exactly one pivot line on describe-target-health', () => {
    const pivots = AWS_VERIFICATION.lines.filter((l) => l.pivot)
    expect(pivots).toHaveLength(1)
    expect(pivots[0].text).toContain('describe-target-health')
  })

  // The note tells the reader to read a table. Without --output table the
  // pasted command prints JSON, so the artifact describes output it does not
  // produce — the same shape as stage 04's "run a script we never showed you".
  test('command 2 carries --output table, since its note describes reading a table', () => {
    const text = AWS_VERIFICATION.lines.map((l) => l.text).join('\n')
    const cmd2 = text.split('# 3.')[0].split('# 2.')[1]
    expect(cmd2).toContain('--output table')
  })

  // The doc gives each command a success reading AND a failure reading. The
  // failure reading is the half a reader actually needs at 2am.
  test('command 2 explains what two PRIMARY deployments mean', () => {
    const notes = AWS_VERIFICATION.lines.map((l) => l.note ?? '').join('\n')
    expect(notes).toMatch(/two PRIMARY/i)
  })

  // Scoped to command 1's own note. A search across every note passes on
  // command 4, which is *about* the events — green, and testing nothing.
  test("command 1's own note sends a timeout on to the events, which is the doc's branch", () => {
    const one = AWS_VERIFICATION.lines.find((l) => l.text.startsWith('# 1.'))
    expect(one?.note, 'command 1 has no note').toBeDefined()
    expect(one!.note).toMatch(/events/i)
  })
})
