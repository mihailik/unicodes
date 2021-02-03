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
    selectedCharNumbers,
    leadCharDetails,
    trailCharDetails
  ] = [
      'selectedChar', 'selectedCharLead', 'selectedCharMid', 'selectedCharTrail',
      'selectedCharNumbers',
      'leadCharDetails', 'trailCharDetails'
    ].map(nm => sideHost.getElementsByClassName(nm)[0] as HTMLElement);

  return {
    updateSelection
  };

  function updateSelection(lead: string[], trail: string[]) {
    const leadText = lead.join('');
    const trailText = trail.join('');
    selectedCharLead.textContent = leadText;
    selectedCharTrail.textContent = trailText;
    selectedCharNumbers.textContent = '[' + (leadText.length + trailText.length) + ']';

    updateDetails(leadCharDetails, lead.length ? lead[lead.length - 1] : '');
    updateDetails(trailCharDetails, trail.length ? trail[trail.length - 1] : '');
  }

  function updateDetails(detailsElem: HTMLElement, text: string) {
    if (!text) detailsElem.style.display = 'none';
    else detailsElem.style.display = null;
    const [symbolElem, hexElem, nfcElem, nfdElem] = [
      'symbol', 'hex',
      'nfc', 'nfd'
    ].map(nm => detailsElem.getElementsByClassName(nm)[0] as HTMLElement);

    symbolElem.textContent = text;
    hexElem.textContent = hexStr(text);

    const normalized = typeof text.normalize === 'function' && {
      nfc: text.normalize('NFC'),
      nfd: text.normalize('NFD')
    };

    if (normalized && (normalized.nfc !== text || normalized.nfd !== text)) {
      if (normalized.nfc !== normalized.nfd) {
        nfcElem.textContent = hexStr(normalized.nfc);
        nfdElem.textContent = hexStr(normalized.nfd);
        nfcElem.style.display = null;
        nfdElem.style.display = null;
      }
      else {
        nfcElem.textContent = hexStr(normalized.nfc);
        nfcElem.style.display = null;
        nfdElem.style.display = 'none';
      }
    }
    else {
      nfcElem.style.display = 'none';
      nfdElem.style.display = 'none';
    }
  }

  function hexStr(str: string): string {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      if (hex) hex += ' ';
      hex += str.charCodeAt(i).toString(16).toUpperCase();
    }
    return hex;
  }
}