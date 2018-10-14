import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { debounce, throttle } from 'lodash-es';

export default class VirtualizedList extends React.PureComponent {
    static propTypes = {
        children: PropTypes.any,
        disabled: PropTypes.bool,
        listComponent: PropTypes.element,
        itemComponent: PropTypes.element,
        itemHeight: PropTypes.number.isRequired,
        buffer: PropTypes.number,
        hiddenScroll: PropTypes.bool,
        fillViewportHeight: PropTypes.bool,
        bottomSpace: PropTypes.number,
    };

    static defaultProps = {
        disabled: false,
        listComponent: <div />,
        itemComponent: <div />,
        buffer: 0,
        hiddenScroll: false,
        fillViewportHeight: true,
        bottomSpace: 0,
    };

    state = {
        firstItemIndex: 0,
        viewCount: 0,
        spaceBefore: 0,
        spaceAfter: 0,
    };

    lastScrollTop = 0;

    componentWillMount = () => {
        this.debouncedComputeCurrentView = throttle(this.computeCurrentView, 200);
    };

    componentDidMount = () => {
        this.computeCurrentView();
    };

    componentDidUpdate = nextProps => {
        const previousProps = this.props;

        const previousItems = React.Children.toArray(previousProps.children);
        const nextItems = React.Children.toArray(nextProps.children);

        if(previousItems.length !== nextItems.length)
            this.computeCurrentView();
    };

    getViewportHeightLeftCalc = (idOrElement, ...bottomSpaces) => {
        const element = (typeof idOrElement === 'string') ? document.getElementById(idOrElement) : idOrElement;
        if(!element)
            return 0;

        const viewportOffsetTop = element.getBoundingClientRect().top;
        const styles = window.getComputedStyle(element);

        let outerHeight = 0;
        const props = ['marginTop', 'marginBottom', 'borderTop', 'borderBottom', 'paddingTop', 'paddingBottom'];
        for(const prop of props)
            outerHeight += parseFloat(styles[prop]);

        const bottomSpace = bottomSpaces.reduce((reduced, value) => (reduced += value) && reduced, 0);
        const heightCalc = `calc(100vh - ${viewportOffsetTop}px - ${outerHeight}px - ${bottomSpace}px)`;
        return heightCalc;
    };

    scroll = event => {
        event.preventDefault();
        event.stopPropagation();
        event.persist();
        this.debouncedComputeCurrentView(event);
    };

    computeCurrentView = event => {
        const { children, itemHeight, buffer, fillViewportHeight, bottomSpace } = this.props;
        const { lastScrollTop } = this;

        const element = ReactDOM.findDOMNode(this); //eslint-disable-line

        if(fillViewportHeight)
            element.style.height = this.getViewportHeightLeftCalc(element, bottomSpace);

        const items = React.Children.toArray(children);
        const containerHeight = element.parentNode.clientHeight;

        const viewCount = Math.ceil(containerHeight / itemHeight);

        const scrollTop = event ? event.target.scrollTop : lastScrollTop;
        const firstItemIndex = Math.floor(scrollTop / itemHeight);
        const view = items.slice(firstItemIndex, firstItemIndex + viewCount);
        let bufferedView = [].concat(view);

        let spaceBefore = firstItemIndex * itemHeight;
        let spaceAfter = (items.length - firstItemIndex - viewCount) * itemHeight;

        // if first item is in view then no spaceBefore
        if(view.includes(items[0]))
            spaceBefore = 0;

        // if last item is in view then no spaceAfter
        if(view.includes(items[items.length - 1]))
            spaceAfter = 0;

        console.warn(`virtualContainer scrollTop=${scrollTop} slice=${firstItemIndex}-${firstItemIndex + viewCount} showing=${view.length}/${items.length}`);

        //https://github.com/developerdizzle/react-virtual-list/blob/master/src/utils/getVisibleItemBounds.js

        this.lastScrollTop = scrollTop;
    };

    render = () => {
        const { children, disabled, hiddenScroll, listComponent: ListComponent, itemComponent: ItemComponent } = this.props;
        const { firstItemIndex, viewCount, spaceBefore, spaceAfter } = this.state;

        const styles = { ...(ListComponent.props.style || {}), overflow: 'scroll' }; //, ...(hiddenScroll ? '&::-webkit-scrollbar': { display: 'none' } : {}) };
        const view = React.Children.toArray(children).slice(firstItemIndex, firstItemIndex + viewCount);

        if(disabled) {
            return (
                <ListComponent.type {...ListComponent.props}>
                    {children}
                </ListComponent.type>
            );
        }
        else {
            return (
                <ListComponent.type {...ListComponent.props} style={styles} onScroll={this.scroll}>
                    <ItemComponent.type style={{ height: spaceBefore }} />
                    {view}
                    <ItemComponent.type style={{ height: spaceAfter }} />
                </ListComponent.type>
            );
        }
    };
}