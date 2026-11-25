// Native pickers commit with "change". Text fields need immediate "input".
// Do not rebuild the controls or change an active select's enabled state.
export function bindAnswerControls(controls, onCommit) {
  const bindings = controls.map(control => {
    const event = control.tagName === 'SELECT' ? 'change' : 'input';
    const listener = () => { if (!control.disabled) onCommit(control.id); };
    control.addEventListener(event, listener);
    return {control, event, listener};
  });
  return () => bindings.forEach(({control,event,listener}) => control.removeEventListener(event,listener));
}

export function setControlEnabled(control, enabled) {
  const disabled = !enabled;
  if (control.disabled !== disabled) control.disabled = disabled;
  // Only genuinely hidden/inapplicable answers are discarded.
  if (disabled && control.value !== '') control.value = '';
}

export function readAnswers(controls) {
  return Object.fromEntries(controls.map(control => [control.id, control.disabled ? '' : control.value]));
}

export function visitTimingContext(answers) {
  // A selected visit preference remains editable even if the paragraph later
  // mentions an issue date. Reset/default and disabled fields do not confirm it.
  return {visitTimingConfirmed:['flexible','soon','week','custom'].includes(answers.timing)};
}

export function validateAnswers(answers) {
  if (answers.timing === 'custom' && !answers.timeDetail?.trim()) {
    return {field:'timeDetail', message:'Enter a preferred day or time, or choose “Not sure yet” or “Flexible”.'};
  }
  return null; // Unknown, other and optional answers are allowed.
}
