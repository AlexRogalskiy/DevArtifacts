/**
 * Attaches the scroll event handler
 *
 * @return {void}
 */
function attach() {
    const container = this.options.container;

    if (container instanceof HTMLElement) {
        const style = window.getComputedStyle(container);

        if (style.position === 'static') {
            container.style.position = 'relative';
        }
    }

    container.addEventListener('scroll', this._scroll);
    window.addEventListener('resize', this._scroll);
    this._scroll();
    this.attached = true;
}

export default attach;
