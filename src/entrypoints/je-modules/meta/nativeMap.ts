export function getNativeMap() {
  // Check if Map has been overriden
  if (window.Map.toString() == "function Map() { [native code] }") window.NativeMap = window.Map;
  else {
    // If it is, grab a fresh copy of native Map from the iframe
    const frame = document.createElement("iframe");
    frame.setAttribute("sandbox", "allow-same-origin");
    frame.classList.add("hidden");
    document.body.appendChild(frame);
    if (frame.contentWindow?.Map) window.NativeMap = frame.contentWindow.Map;
    frame.remove();
  }

  if (!(window.Map.toString() == "function Map() { [native code] }")) {
    throw new Error("Failed to get the native Map.")
  }
}
