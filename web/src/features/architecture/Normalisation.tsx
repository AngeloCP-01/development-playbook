import { RevealList } from '@/components/RevealList'
import { NORMAL_FORMS } from './normal-forms'

/**
 * Source: docs/03-architecture.md, "Design the database" — its Normalisation
 * subsection.
 *
 * Behind an expand-to-reveal because `schema` is the second-heaviest panel in
 * the stage and this is reference rather than judgment: a reader who already
 * knows the forms should not scroll past three definitions to reach the DDL,
 * and one who does not should be able to open them where they meet the names.
 *
 * Built on `RevealList`. The violation/exception blocks stay bespoke markup
 * rather than becoming `RevealFacet`: they are styled with `t-label` (mono,
 * tracked caps), and `RevealFacet` hardcodes
 * `text-xs font-semibold uppercase tracking-wide` — a different font, size
 * and weight. Swapping in `RevealFacet` here would change what renders, not
 * just where it lives.
 */

export function Normalisation() {
  return (
    <RevealList
      idPrefix="normal-form"
      rows={NORMAL_FORMS.map((form) => ({
        id: form.id,
        title: form.name,
        summary: form.rule,
        body: (
          <>
            <div>
              <p className="t-label text-warn">The violation</p>
              <p className="mt-1 text-sm leading-6 text-muted">
                {form.violation}
              </p>
            </div>
            {form.exception && (
              <div className="mt-3">
                <p className="t-label text-blueprint">
                  Where this stage breaks it on purpose
                </p>
                <p className="mt-1 text-sm leading-6 text-muted">
                  {form.exception}
                </p>
              </div>
            )}
          </>
        ),
      }))}
      footer={
        <p className="border-t border-line bg-raised px-5 py-4 text-sm leading-6 text-muted">
          Third is the one worth aiming at. Past it the forms get stricter and
          the returns get thinner, and you would be reaching for them to satisfy
          a definition rather than to fix something.
        </p>
      }
    />
  )
}
