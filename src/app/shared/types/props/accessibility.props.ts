export interface PropsAriaLabel {
  ariaLabel?: string;
}

export interface PropsAriaDescription {
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

export interface PropsAccessibility extends PropsAriaLabel, PropsAriaDescription {}

export interface PropsAccessibilityLabel {
  accessibilityLabel?: string;
}
