const CACHE_NAME = 'waste-schedule-v3';
const ASSETS = [
    '/',
    '/index.html',
    '/settings.html',
    '/manifest.json',
    '/harmonogram-definicje.json',
    '/assets/favicon.png',
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png',
    '/assets/zmieszane.png',
    '/assets/sztuczne.png',
    '/assets/papier.png',
    '/assets/szklo.png',
    '/assets/bio.png',
    '/assets/gabaryty.png',
    '/assets/choinki.png',
    '/assets/brak.png'
];

let notificationSettings = {
    enabled: false,
    day: "1",
    time: "09:00",
    town: null,
    street: null
};

// --- Service Worker Lifecycle ---

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(keys => {
                return Promise.all(
                    keys.filter(key => key !== CACHE_NAME)
                        .map(key => caches.delete(key))
                );
            })
        ])
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseClone);
                    });
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

// --- Custom Event Listeners ---

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'settings-updated') {
        notificationSettings = event.data.settings;
        console.log('SW settings updated:', notificationSettings);
        
        if (notificationSettings.enabled) {
            registerPeriodicSync();
        } else {
            unregisterPeriodicSync();
        }
    }
});

self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : { title: 'Śmieciapka', body: 'Coś nowego!' };
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/assets/icon-192x192.png'
        })
    );
});

self.addEventListener('periodicsync', event => {
    if (event.tag === 'notification-check') {
        event.waitUntil(checkForWasteAndNotify());
    }
});


// --- Helper Functions ---

async function registerPeriodicSync() {
    if ('periodicSync' in self.registration) {
        try {
            await self.registration.periodicSync.register('notification-check', {
                minInterval: 12 * 60 * 60 * 1000, // 12 hours
            });
            console.log('Periodic sync registered.');
        } catch (error) {
            console.error('Periodic sync could not be registered:', error);
        }
    } else {
        console.warn('Periodic Background Sync not supported.');
    }
}

async function unregisterPeriodicSync() {
    if ('periodicSync' in self.registration) {
        await self.registration.periodicSync.unregister('notification-check');
        console.log('Periodic sync unregistered.');
    }
}

function dateToISOString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function getWasteForDate(schedule, date) {
    if (!schedule || !schedule.dates) return [];
    const dateString = dateToISOString(date);
    const wasteTypes = [];
    const WASTE_CATEGORIES = {
        "zmieszane": "Odpady zmieszane", "bio": "Odpady BIO", "papier": "Papier",
        "szklo": "Szkło", "sztuczne": "Metale i tworzywa sztuczne",
        "gabaryty": "Odpady wielkogabarytowe", "choinki": "Choinki"
    };

    for (const [category, dates] of Object.entries(schedule.dates)) {
        if (Array.isArray(dates) && dates.includes(dateString)) {
            wasteTypes.push(WASTE_CATEGORIES[category] || category);
        }
    }
    return wasteTypes;
}

function getScheduleIdForLocation(definitions, town, street) {
    if (!definitions || !definitions.miejscowosci) return null;
    const townData = definitions.miejscowosci[town];
    if (!townData) return null;

    if (street && townData.streetRules) {
        const normalizedStreet = street.trim().toLowerCase();
        for (const rule of townData.streetRules) {
            if (rule.streets.find(s => s.trim().toLowerCase().startsWith(normalizedStreet))) {
                return rule.scheduleId;
            }
        }
    }
    return townData.defaultScheduleId;
}

async function checkForWasteAndNotify() {
    if (!notificationSettings.enabled || !notificationSettings.town) {
        console.log('Notifications disabled or location not set.');
        return;
    }

    // This logic is simplified to trigger notification anytime on the correct day.
    // Precise timing is not guaranteed with Periodic Sync.
    
    const dayOffset = parseInt(notificationSettings.day, 10);
    const targetDate = new Date();
    targetDate.setHours(0, 0, 0, 0); // Start of day
    targetDate.setDate(targetDate.getDate() + dayOffset);

    try {
        const defsResponse = await fetch('/harmonogram-definicje.json');
        if (!defsResponse.ok) throw new Error('Failed to fetch definitions');
        const definitions = await defsResponse.json();

        const scheduleId = getScheduleIdForLocation(definitions, notificationSettings.town, notificationSettings.street);
        if (!scheduleId) {
             console.log(`No schedule ID for ${notificationSettings.town}`);
             return;
        }

        const scheduleResponse = await fetch(`/harmonograms/${scheduleId}.json`);
        if (!scheduleResponse.ok) throw new Error('Failed to fetch schedule');
        const scheduleData = await scheduleResponse.json();
        
        const wasteTypes = await getWasteForDate(scheduleData, targetDate);

        if (wasteTypes.length > 0) {
            const title = 'Śmieciapka przypomina!';
            
            let dayDescription = '';
            if (dayOffset === 0) {
                dayDescription = 'Dzisiaj';
            } else if (dayOffset === 1) {
                dayDescription = 'Jutro';
            } else {
                dayDescription = `Za ${dayOffset} dni`;
            }

            const body = `${dayDescription} odbierają: ${wasteTypes.join(', ')}.`;

            await self.registration.showNotification(title, {
                body: body,
                icon: '/assets/icon-192x192.png',
                tag: `waste-notification-${dateToISOString(targetDate)}` // Tag to prevent duplicate notifications
            });
            console.log('Notification shown:', body);
        } else {
            console.log(`No waste collection for ${dateToISOString(targetDate)}.`);
        }

    } catch (error) {
        console.error('Error during notification check:', error);
    }
}
