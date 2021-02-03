declare namespace initSide {
  type SideController = {
    updateSelection(lead: string[], trail: string[]): void;
  }
}

function initSide(sideHost: HTMLElement): initSide.SideController {

  const [
    selectedChar,
    selectedCharLead,
    selectedCharMid,
    selectedCharTrail,
    selectedCharNumbers
  ] = ['selectedChar', 'selectedCharLead', 'selectedCharMid', 'selectedCharTrail', 'selectedCharNumbers'].map(
    nm => sideHost.getElementsByClassName(nm)[0] as HTMLElement);

  return {
    updateSelection
  };

  function updateSelection(lead: string[], trail: string[]) {
    const leadText = lead.join('');
    const trailText = trail.join('');
    selectedCharLead.textContent = leadText;
    selectedCharTrail.textContent = trailText;
    selectedCharNumbers.textContent = (leadText.length + trailText.length) + ' unit' + (leadText.length + trailText.length > 1 ? 's' : '');
  }

}