// Simple privacy analyzer for browser settings
function analyzePrivacySettings() {
    let score = 100;
    const tips = [];

    // 1. Cookies Enabled
    if (navigator.cookieEnabled) {
        score -= 10;
        tips.push("Consider blocking third-party cookies for more privacy.");
    }

    // 2. Do Not Track
    if (navigator.doNotTrack !== "1") {
        score -= 10;
        tips.push("Enable 'Do Not Track' in your browser settings to request less tracking.");
    }

    // 3. WebRTC Leak (IP leak check)
    // We can't actually detect WebRTC leaks in JS without server assist, so we check for WebRTC support
    if (window.RTCPeerConnection) {
        score -= 10;
        tips.push("Disable WebRTC in your browser to prevent possible IP leaks.");
    }

    // 4. JavaScript Enabled (if running, it's enabled)
    // Some privacy-focused users may want to disable JS
    if (typeof window !== "undefined" && typeof document !== "undefined") {
        score -= 5;
        tips.push("Consider limiting JavaScript execution with privacy extensions.");
    }

    // 5. Local Storage Enabled
    try {
        localStorage.setItem("privacy_test", "1");
        localStorage.removeItem("privacy_test");
        score -= 5;
        tips.push("Disable or clear local storage regularly to prevent persistent tracking.");
    } catch(e) {
        // Local storage disabled or restricted
    }

    // 6. Geolocation
    if ("geolocation" in navigator) {
        score -= 10;
        tips.push("Disable or limit geolocation access for sites.");
    }

    // 7. Referrer Policy (limited in JS, but we can check document.referrer)
    if (document.referrer !== "") {
        score -= 5;
        tips.push("Set your browser to send minimal referrer information.");
    }

    // 8. Browser fingerprinting: check for plugins
    if (navigator.plugins && navigator.plugins.length > 0) {
        score -= 5;
        tips.push("Limit browser plugins/extensions to reduce fingerprinting risk.");
    }

    // 9. Ad/tracker blocker (can't directly check, but can suggest)
    score -= 10;
    tips.push("Install a reputable ad/tracker blocker like uBlock Origin or Privacy Badger.");

    // 10. HTTPS usage (we can check if current page is HTTPS)
    if (location.protocol !== "https:") {
        score -= 10;
        tips.push("Always use HTTPS websites to protect your data in transit.");
    }

    // Clamp score between 0-100
    score = Math.max(0, Math.min(100, score));
    return { score, tips };
}

document.getElementById("scanBtn").addEventListener("click", () => {
    const results = analyzePrivacySettings();
    document.getElementById("privacyScore").textContent = results.score;
    const tipsList = document.getElementById("privacyTips");
    tipsList.innerHTML = "";
    results.tips.forEach(tip => {
        const li = document.createElement("li");
        li.textContent = tip;
        tipsList.appendChild(li);
    });
    document.getElementById("results").classList.remove("hidden");
});