// Load translations
export async function loadTranslations(language) {
    try {
        const response = await fetch('../localization.json');
        if (!response.ok) {
            throw new Error(`Failed to load translations: ${response.statusText}`);
        }
        const translations = await response.json();
        return translations[language]; // Return the translations for the selected language
    } catch (error) {
        console.error('Error loading translations:', error);
        return {}; // Return an empty object on error
    }
}

// Apply translations to the DOM
function applyTranslations(translations) {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (element.tagName === 'INPUT' && element.type === 'text') {
            element.setAttribute('placeholder', translations[key]);
        } else {
            element.textContent = translations[key];
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const languageSelector = document.getElementById('language-selector');
    const defaultLanguage = localStorage.getItem('language') || 'en';

    // Change language
    languageSelector.addEventListener('change', async (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('language', selectedLanguage);
        const translations = await loadTranslations(selectedLanguage);
        applyTranslations(translations);
    });

    // Initialize with default language
    languageSelector.value = defaultLanguage;
    const translations = await loadTranslations(defaultLanguage);
    applyTranslations(translations);
});