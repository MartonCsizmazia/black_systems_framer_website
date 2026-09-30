import './LabelBar.css'

export interface LabelBarProps {
  rollNo: string
  label: string
  year?: string
}

/**
 * Recovered from the "Black" section-header component (.framer-aDVwY) used
 * on the case study page: a 16% divider, then "◆ (0X)" far left and a
 * label + year pair pinned to the right half (fixed 467px gap between them).
 * SectionEyebrow is the home page's simpler 3-column cousin of this, with no
 * diamond icon and the label centred.
 */
export default function LabelBar({ rollNo, label, year = '© 2025' }: LabelBarProps) {
  return (
    <div className="label-bar">
      <div className="label-bar__line" />
      <div className="label-bar__content text-preset-152twjm">
        <div className="label-bar__roll">
          <span className="label-bar__icon" />
          <span>{rollNo}</span>
        </div>
        <div className="label-bar__details">
          <span>{label}</span>
          <span>{year}</span>
        </div>
      </div>
    </div>
  )
}
