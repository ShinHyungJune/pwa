// Progressive Enhancement (SW supported)

if ('serviceWorker' in navigator) {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register('/sw.js').then((registration) => {

        }).catch(console.log)
    }
}