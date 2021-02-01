declare namespace initSide {
  type SideController = {
    updateSelection(text: string): void;
  }
}

function initSide(sideHost: HTMLElement): initSide.SideController {

  return {
    updateSelection
  };

  function updateSelection(text: string) {
    sideHost.textContent = text;
  }

}