import React from 'react';
import PropTypes from 'prop-types';

import pathToRegexp from 'path-to-regexp';
import qs from 'qs';

export const getHistoryEntry = href => {
    const url = new URL(href);
    const params = qs.parse(url.search.slice(1), { strictNullHandling: true });

    const result = {};
    for(const key of ['href', 'origin', 'host', 'hostname', 'protocol', 'port', 'pathname', 'search', 'hash', 'username', 'password'])
        result[key] = url[key];
    result.params = params;

    // console.log('getHistoryEntry', href, '=>', result);
    return result;
};

const firstHistoryEntry = getHistoryEntry(window.location.href);

export const { Provider, Consumer } = React.createContext({
    ...firstHistoryEntry,
    history: [firstHistoryEntry],
    redirect: Function.prototype,
});

export default class Router extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node,
        basePathname: PropTypes.string,
        basePathnameAutoRedirect: PropTypes.bool,
    };

    static defaultProps = {
        basePathname: '/',
        basePathnameAutoRedirect: true,
    };

    constructor (props) {
        super(props);

        const { basePathname, basePathnameAutoRedirect } = this.props;

        if(!window.location.pathname.startsWith(basePathname)) {
            if (!basePathnameAutoRedirect) {
                // console.warn(`Router with basePathname=${basePathname} was initialised but we're not on that basePathname`);
            }
            else {
                // console.warn(`Router with basePathname=${basePathname} basePathnameAutoRedirect=${basePathnameAutoRedirect} was initialised but we're not on that basePathname thus redirect to it`);
                window.history.replaceState({}, window.document.title, basePathname);
            }
        }

        const current = getHistoryEntry(window.location.href);

        this.state = {
            ...current,
            basePathname,
            history: [current],
            // methods
            match: this.match,
            getBasedPathname: this.getBasedPathname,
            //
            redirect: this.redirect,
            go: this.go,
            back: this.back,
            forward: this.forward,
        };
    }

    redirect = pathname => event => {
        const { history } = this.state;

        event.preventDefault();

        const state = {};
        const title = '';
        const basedPathname = this.getBasedPathname(pathname);

        window.history.pushState(state, title, basedPathname);
        window.scrollTo(0, 0);

        const current = getHistoryEntry(window.location.origin + basedPathname);

        this.setState({
            ...current,
            history: [current, ...history],
        });
    };

    // we don't want: 1) /user to become /user/ 2) //
    getBasedPathname = pathname => {
        const { basePathname } = this.props;
        const searchMatch = pathname.match(/\?(?<search>.+?)$/);
        const search = searchMatch ? searchMatch.groups.search : '';

        pathname = pathname.replace(/\?(?<search>.+?)$/, '');

        let basedPathname = (basePathname + pathname);
        // no //
        basedPathname = basedPathname.replace('//', '/');
        // no /user/
        basedPathname = (basedPathname.length > 1 && basedPathname.endsWith('/')) ? basedPathname.slice(0, -1) : basedPathname;
        // after basing, re-add the search
        basedPathname += search ? '?' + search : '';

        return basedPathname;
    };

    match = pathname => {
        const { pathname: currentPathname } = this.state;

        const basedPathname = this.getBasedPathname(pathname).replace(/\?.+?/, '');

        const keys = [];
        const matcher = pathToRegexp(basedPathname, keys);
        const match = matcher.exec(currentPathname);

        let result;

        if(match) {
            const params = {};
            for(const index in keys) {
                const key = keys[index];
                params[key.name] = match[+index+1];
            }
            result = params;
        }
        else
            result = false;

        return result;
    };

    render = () => {
        const { children } = this.props;

        return (
            <Provider value={this.state}>{children}</Provider>
        );
    };
}