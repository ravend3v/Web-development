function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "Unknown";

    if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Mozilla Firefox";
        browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
    } else if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Google Chrome";
        browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
    } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Apple Safari";
        browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)[1];
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) {
        browserName = "Microsoft Internet Explorer";
        browserVersion = userAgent.match(/(MSIE |rv:)(\d+\.\d+)/)[2];
    } else if (userAgent.indexOf("Edge") > -1) {
        browserName = "Microsoft Edge";
        browserVersion = userAgent.match(/Edge\/(\d+\.\d+)/)[1];
    }

    return { browserName, browserVersion };
}


function getOs() {
    const userAgent = navigator.userAgent;
    let osName = "Unknown";

    if (userAgent.indexOf("Windows") > -1) {
        osName = "Microsoft Windows";
    } else if (userAgent.indexOf("Mac") > -1) {
        osName = "Apple macOS";
    } else if (userAgent.indexOf("Linux") > -1) {
        osName = "Linux";
    } else if (userAgent.indexOf("Android") > -1) {
        osName = "Android";
    } else if (userAgent.indexOf("like Mac") > -1) {
        osName = "iOS";
    }

    return { osName };
}

function getScreenInfo() {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    const availableWidth = window.screen.availWidth;
    const availableHeight = window.screen.availHeight;

    return { screenWidth, screenHeight, availableWidth, availableHeight }
}

function getCurrentDateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const dateTime = now.toLocaleDateString('fi-FI', options)

    return dateTime;
}

const browserInfo = getBrowserInfo();
const osInfo = getOs();
const screenInfo = getScreenInfo();
const currentDateTime = getCurrentDateTime();

document.getElementById('target').innerHTML = 
    `
        <p>Browser: ${browserInfo.browserName}, Version: ${browserInfo.browserVersion}</p>
        <p>Operating System: ${osInfo.osName}</p>
        <p>Screen Width: ${screenInfo.screenWidth}, Screen Height: ${screenInfo.screenHeight}</p>
        <p>Available Width: ${screenInfo.availableWidth}, Available Height: ${screenInfo.availableHeight}</p>
        <p>Current Date and Time: ${currentDateTime}</p>
    `
;
