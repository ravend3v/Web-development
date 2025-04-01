// filepath: c:\Users\elkku\VScode projects\Web-development\yksilötehtävä\scripts\language.js
document.addEventListener('DOMContentLoaded', () => {
    const languageSelector = document.getElementById('language-selector');
    const defaultLanguage = localStorage.getItem('language') || 'en';

    // Load translations
    async function loadTranslations(language) {
        const response = await fetch('./localization.json');
        const translations = await response.json();
        applyTranslations(translations[language]);
    }

    // Apply translations to the DOM
    function applyTranslations(translations) {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            element.textContent = translations[key];
        });
    }

    // Change language
    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('language', selectedLanguage);
        loadTranslations(selectedLanguage);
    });

    // Initialize with default language
    languageSelector.value = defaultLanguage;
    loadTranslations(defaultLanguage);
});