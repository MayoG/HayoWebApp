function getMobileOperatingSystem() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return "iOS";
    }

    // Android detection
    if (/android/i.test(userAgent)) {
        return "Android";
    }

    return "unknown";
}

function redirectToStore() {
    const os = getMobileOperatingSystem();
    
    // Replace these URLs with your actual App Store and Play Store URLs when they're available
    const APP_STORE_URL = "https://apps.apple.com/us/app/365scores-live-scores-news/id571801488";  // Your iOS app URL
    const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.scores365";  // Your Android app URL
    const FALLBACK_URL = `../index.html#download`;  // Fallback to download section if OS is unknown

    switch(os) {
        case "iOS":
            window.location.href = APP_STORE_URL;
            break;
        case "Android":
            window.location.href = PLAY_STORE_URL;
            break;
        default:
            window.location.href = FALLBACK_URL;
    }
}
