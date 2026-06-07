type PlateLabelProps = {
  plate: string
  label: string
  active?: boolean
  tone?: 'paper' | 'ink'
}

export default function PlateLabel({ plate, label, active = false, tone = 'ink' }: PlateLabelProps) {
  const textClass = tone === 'paper' ? 'text-paper' : 'text-ink'
  const softClass = tone === 'paper' ? 'text-paper/55' : 'text-ink-soft'

  return (
    <div className="mono flex flex-col gap-3 text-[11px] uppercase tracking-normal">
      <span className={active ? 'text-accent' : textClass}>{plate}</span>
      <span className="plate-rule" aria-hidden="true" />
      <span className={softClass}>{label}</span>
    </div>
  )
}
