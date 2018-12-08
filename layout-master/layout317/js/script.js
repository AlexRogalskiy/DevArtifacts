const setValue = (property, value) => {
    if (value) {
        document.documentElement.style.setProperty(`--${property}`, value);

        const input = document.querySelector(`#${property}`);
        if (input) {
            value = value.replace('px', '');
            input.value = value;
        }
    }
};

const setValueFromLocalStorage = property => {
    let value = localStorage.getItem(property);
    setValue(property, value);
};

const setTheme = options => {
    for (let option of Object.keys(options)) {
        const property = option;
        const value = options[option];

        setValue(property, value);
        localStorage.setItem(property, value);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setValueFromLocalStorage('background-color');
    setValueFromLocalStorage('text-color');
    setValueFromLocalStorage('label-color');
    setValueFromLocalStorage('border-color');
    setValueFromLocalStorage('base-font-size');
    setValueFromLocalStorage('base-line-height');
});

const dataThemeButtons = document.querySelectorAll('[data-theme]');

for (let i = 0; i < dataThemeButtons.length; i++) {
    dataThemeButtons[i].addEventListener('click', () => {
        const theme = dataThemeButtons[i].dataset.theme;

        switch (theme) {
            case 'green':
                setTheme({
                    'background-color': '#2eec96',
                    'text-color': '#222222',
                    'label-color': '#1a905d',
                    'border-color': 'rgba(250, 250, 250, 0.5)'
                });
                return;

            case 'blue':
                setTheme({
                    'background-color': '#3f51b5',
                    'text-color': '#ffffff',
                    'label-color': '#ff5252',
                    'border-color': 'rgba(250, 250, 250, 0.5)'
                });
                return;

            case 'yellow':
                setTheme({
                    'background-color': '#ffeb3b',
                    'text-color': '#222222',
                    'label-color': '#ff5252',
                    'border-color': 'rgba(250, 250, 250, 0.5)'
                });
                return;

            case 'black':
                setTheme({
                    'background-color': '#222222',
                    'text-color': '#ffffff',
                    'label-color': '#ff5252',
                    'border-color': 'rgba(250, 250, 250, 0.5)'
                });
                return;

            case 'white':
                setTheme({
                    'background-color': '#ffffff',
                    'text-color': '#222222',
                    'label-color': '#ff5252',
                    'border-color': '#dddddd'
                });
                return;
        }
    })
}

const handleInputChange = (property, pixels) => {
    document.documentElement.style.setProperty(`--${property}`, `${event.target.value}${pixels ? 'px' : ''}`);
    localStorage.setItem(property, `${event.target.value}${pixels ? 'px' : ''}`);
};

document.querySelector('#background-color').addEventListener('change', event => {
    handleInputChange('background-color', false);
})

document.querySelector('#text-color').addEventListener('change', event => {
    handleInputChange('text-color', false);
});

document.querySelector('#label-color').addEventListener('change', event => {
    handleInputChange('label-color', false);
});

document.querySelector('#base-font-size').addEventListener('input', event => {
    handleInputChange('base-font-size', true);
});

document.querySelector('#base-line-height').addEventListener('input', event => {
    handleInputChange('base-line-height', false);
});