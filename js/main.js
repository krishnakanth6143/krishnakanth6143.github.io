document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navigation = document.querySelector('.nav-links');
    const links = [...navigation.querySelectorAll('a')];
    const themeSwitch = document.querySelector('.theme-switch');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const mobileLayout = window.matchMedia('(max-width: 760px)');

    // Preferences are optional: the page also works with browser storage blocked.
    const readPreference = (key) => {
        try { return localStorage.getItem(key); } catch { return null; }
    };
    const savePreference = (key, value) => {
        try { localStorage.setItem(key, value); } catch { /* Keep this session usable. */ }
    };

    const setMenu = (open, returnFocus = false) => {
        navigation.classList.toggle('active', open);
        burger.classList.toggle('toggle', open);
        burger.setAttribute('aria-expanded', String(open));
        const language = document.documentElement.lang;
        const labels = translations[language] || translations.en;
        burger.setAttribute('aria-label', labels[open ? 'menu-close' : 'menu-open']);
        if (returnFocus) burger.focus();
    };
    burger.addEventListener('click', () => setMenu(!navigation.classList.contains('active')));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navigation.classList.contains('active')) setMenu(false, true);
    });
    document.addEventListener('click', (event) => {
        if (!event.target.closest('nav') && navigation.classList.contains('active')) setMenu(false);
    });
    document.addEventListener('focusin', (event) => {
        if (!event.target.closest('nav') && navigation.classList.contains('active')) setMenu(false);
    });
    mobileLayout.addEventListener('change', () => setMenu(false));
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', () => {
            // Native anchors retain URL history, focus, and reduced-motion behavior.
            if (navigation.classList.contains('active')) setMenu(false);
        });
    });

    const updateThemeLabel = () => {
        const dark = document.body.classList.contains('dark-mode');
        const labels = translations[document.documentElement.lang] || translations.en;
        const label = labels[dark ? 'theme-light' : 'theme-dark'];
        themeSwitch.setAttribute('aria-label', label);
        themeSwitch.setAttribute('title', label);
        themeSwitch.setAttribute('aria-pressed', String(dark));
    };
    const applyTheme = (dark) => {
        document.body.classList.toggle('dark-mode', dark);
        document.body.classList.toggle('light-mode', !dark);
        updateThemeLabel();
    };
    let selectedTheme = readPreference('theme');
    applyTheme(selectedTheme === 'dark' || (selectedTheme !== 'light' && systemTheme.matches));
    themeSwitch.addEventListener('click', () => {
        const dark = !document.body.classList.contains('dark-mode');
        selectedTheme = dark ? 'dark' : 'light';
        savePreference('theme', selectedTheme);
        applyTheme(dark);
    });
    systemTheme.addEventListener('change', (event) => {
        if (!selectedTheme) applyTheme(event.matches);
    });

    const languageButtons = [...document.querySelectorAll('[data-lang]')];
    const setLanguage = (language) => {
        const supported = Object.hasOwn(translations, language) ? language : 'en';
        applyTranslations(supported);
        languageButtons.forEach((button) => {
            const active = button.dataset.lang === supported;
            button.classList.toggle('active', active);
            button.setAttribute('aria-pressed', String(active));
        });
        updateThemeLabel();
        setMenu(false);
    };
    languageButtons.forEach((button) => button.addEventListener('click', () => {
        savePreference('language', button.dataset.lang);
        setLanguage(button.dataset.lang);
    }));
    setLanguage(readPreference('language') || 'en');

    // Update the active section once per frame, avoiding repeated layout work.
    let scheduled = false;
    const sections = [...document.querySelectorAll('main section[id]')];
    const updateNavigation = () => {
        let current = sections[0].id;
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
        for (const section of sections) {
            if (section.getBoundingClientRect().top <= 160) current = section.id;
        }
        if (atBottom) current = sections[sections.length - 1].id;
        links.forEach((link) => {
            const active = link.hash === '#' + current;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        scheduled = false;
    };
    window.addEventListener('scroll', () => {
        if (!scheduled) {
            scheduled = true;
            window.requestAnimationFrame(updateNavigation);
        }
    }, { passive: true });
    window.addEventListener('resize', updateNavigation);
    updateNavigation();
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
});
