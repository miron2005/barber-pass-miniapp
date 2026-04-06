const elements = {
  statusText: document.querySelector("#statusText"),
  scanButton: document.querySelector("#scanButton"),
  manualToken: document.querySelector("#manualToken"),
  sendManualButton: document.querySelector("#sendManualButton"),
};

const telegram = window.Telegram?.WebApp;

init();

function init() {
  if (!telegram) {
    setStatus("Это Mini App нужно открывать из Telegram.", true);
    elements.scanButton.disabled = true;
    return;
  }

  telegram.ready();
  telegram.expand();
  elements.scanButton.addEventListener("click", startScan);
  elements.sendManualButton.addEventListener("click", sendManual);
}

function startScan() {
  if (!telegram?.showScanQrPopup) {
    setStatus("В этом клиенте Telegram нет нативного QR-сканера. Вставь код вручную.", true);
    return;
  }

  telegram.showScanQrPopup(
    {
      text: "Наведите камеру на QR клиента",
    },
    (value) => {
      sendToken(value);
      return true;
    }
  );
}

function sendManual() {
  sendToken(elements.manualToken.value.trim());
}

function sendToken(token) {
  if (!token) {
    setStatus("Код пустой. Отсканируй QR или вставь token вручную.", true);
    return;
  }

  setStatus("Код отправляется в бот...", false);

  telegram.sendData(
    JSON.stringify({
      type: "scan_qr",
      token,
    })
  );
}

function setStatus(message, isError) {
  elements.statusText.textContent = message;
  elements.statusText.style.color = isError ? "#f0b4b4" : "#aab6ac";
}
