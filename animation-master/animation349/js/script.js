const options = {
    rootMargin: '-100px',
    threshold: [0.5, 1]
}

const callback = entries => {
    entries.forEach(entry => {
        const ratio = entry.intersectionRatio;

        switch (true) {
            case (ratio === 1):
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'scale(1.25)';
                return;
            case (ratio < 1 && ratio >= 0.5):
                entry.target.style.opacity = 0.5;
                entry.target.style.transform = 'scale(1.1)';
                return;
            case (ratio < 0.5):
                entry.target.style.opacity = 0.15;
                entry.target.style.transform = 'scale(1.0)';
                return;
            default:
                return;
        }
    });
}

const observer = new IntersectionObserver(callback, options);

const targets = document.querySelectorAll('.card');
targets.forEach(target => observer.observe(target));