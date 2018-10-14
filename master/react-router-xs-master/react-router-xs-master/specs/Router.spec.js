import React from 'react';
import { Router, Route, Link, withRouter } from '../src';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const Component1 = props => <div />;
const Component2 = props => <div />;
const Component3 = props => <div />;
const ComponentWithRouter = withRouter(Component1);

const FakeEvent = { preventDefault: Function.prototype };
const redirect = pathname => window.history.pushState({}, '', pathname);
global.scrollTo = jest.fn();

const getRouter = shallowOrMount => Enzyme[shallowOrMount](
    <Router>
        <Route pathname={'/'} component={Component1} />
        <Route pathname={'/item'} component={Component2} />
        <Route pathname={'/collection/:offset'} component={Component3} />
        <Route pathname={'/collection/:offset/:limit/:order(asc|desc)?'} component={Component3} />
        <Route pathname={'/hoc'} component={ComponentWithRouter} />

        <Link id={'nav1'} pathname={'/'} />
        <Link id={'nav2'} pathname={'/item'} currentClassName={'active'} />
        <Link id={'nav3'} pathname={'/item?hello=world#scroll'} currentClassName={'active'} />
    </Router>
);

const getBasedRouter = shallowOrMount => Enzyme[shallowOrMount](
    <Router basePathname={'/user'} basePathnameAutoRedirect={true}>
        <Route pathname={'/'} component={Component1} />
        <Route pathname={'/item'} component={Component2} />
        <Route pathname={'/collection/:offset'} component={Component3} />
        <Route pathname={'/collection/:offset/:limit/:order(asc|desc)?'} component={Component3} />

        <Link id={'nav1'} pathname={'/'} />
        <Link id={'nav2'} pathname={'/item'} currentClassName={'active'} />
        <Link id={'nav3'} pathname={'/item?hello=world#scroll'} currentClassName={'active'} />
    </Router>
);

const getBasedRouterWithoutAutoredirect = shallowOrMount => Enzyme[shallowOrMount](
    <Router basePathname={'/user'} basePathnameAutoRedirect={false}>
        <Route pathname={'/'} component={Component1} />
        <Route pathname={'/item'} component={Component2} />
        <Route pathname={'/collection/:offset'} component={Component3} />
        <Route pathname={'/collection/:offset/:limit/:order(asc|desc)?'} component={Component3} />

        <Link id={'nav1'} pathname={'/'} currentClassName={'active'} />
        <Link id={'nav2'} pathname={'/item'} currentClassName={'active'} />
        <Link id={'nav3'} pathname={'/item?hello=world#scroll'} currentClassName={'active'} />
    </Router>
);

// testURL is http://localhost thus initial pathname is /
// mount still broken with new react context
describe('Router', async () => {
    it('"/" renders Component1', async () => {
        const router = getRouter('mount');
        expect(window.location.pathname).toEqual('/');
        expect(router.find(Component1)).toHaveLength(1);
        expect(router.html()).toEqual('<div></div>');
    });

    it('"/item" renders Component2', async () => {
        redirect('/item');
        const router = getRouter('mount');
        expect(window.location.pathname).toEqual('/item');
        expect(router.find(Component2)).toHaveLength(1);
        expect(router.html()).toEqual('<div></div>');
    });

    it('"/collection/123" renders Component3', async () => {
        redirect('/collection/123');
        const router = getRouter('mount');
        expect(window.location.pathname).toEqual('/collection/123');
        expect(router.find(Component3)).toHaveLength(1);
        expect(router.html()).toEqual('<div></div>');
        expect(router.find(Component3).props().offset).toEqual('123');
    });

    it('"/collection/123/456" renders Component3 with offset, limit', async () => {
        redirect('/collection/123/456');
        const router = getRouter('mount');
        expect(window.location.pathname).toEqual('/collection/123/456');
        expect(router.find(Component3)).toHaveLength(1);
        expect(router.html()).toEqual('<div></div>');
        expect(router.find(Component3).props().offset).toEqual('123');
        expect(router.find(Component3).props().limit).toEqual('456');
        expect(router.find(Component3).props().order).toEqual(undefined);
    });

    it('"/collection/123/456/asc" renders Component3 with offset, limit, order', async () => {
        redirect('/collection/123/456/asc');
        const router = getRouter('mount');
        expect(window.location.pathname).toEqual('/collection/123/456/asc');
        expect(router.find(Component3)).toHaveLength(1);
        expect(router.html()).toEqual('<div></div>');
        expect(router.find(Component3).props().offset).toEqual('123');
        expect(router.find(Component3).props().limit).toEqual('456');
        expect(router.find(Component3).props().order).toEqual('asc');
    });

    it('redirect calls window.history.pushState, renders Component3', async() => {
        redirect('/');
        const router = getRouter('shallow');
        expect(window.location.pathname).toEqual('/');
        router.instance().redirect('/collection/dogs')(FakeEvent);
        expect(window.location.pathname).toEqual('/collection/dogs');
    });
});

describe('Router with basePathname={\'/user\'}', async () => {
    it('it doesn\'t autoredirect to basePathname if not on it and basePathnameAutoRedirect=false', async () => {
        redirect('/');
        const router = getBasedRouterWithoutAutoredirect('mount');
        expect(window.location.pathname).toEqual('/');
    });

    it('it does autoredirect to basePathname if not on it and basePathnameAutoRedirect=true', async () => {
        redirect('/');
        const router = getBasedRouter('mount');
        expect(window.location.pathname).toEqual('/user');
    });

    it('"/" renders Component1 with href=/user', async () => {
        redirect('/user');
        const router = getBasedRouter('mount');
        expect(window.location.pathname).toEqual('/user');
        expect(router.find(Component1)).toHaveLength(1);
        expect(router.html()).toEqual('<div></div>');
    });

    it('redirect calls window.history.pushState with basePathname+pathname, renders Component1', async() => {
        redirect('/user');
        const router = getBasedRouter('shallow');
        expect(window.location.pathname).toEqual('/user');
        router.instance().redirect('/')(FakeEvent);
        expect(window.location.pathname).toEqual('/user');
    });

    it('redirect calls window.history.pushState with basePathname+pathname, renders Component3', async() => {
        redirect('/user');
        const router = getBasedRouter('shallow');
        expect(window.location.pathname).toEqual('/user');
        router.instance().redirect('/collection/dogs')(FakeEvent);
        expect(window.location.pathname).toEqual('/user/collection/dogs');
    });
});

describe('Link', async () => {
    it('pathname="/item" renders Component2', async () => {
        global.scrollTo = jest.fn();
        redirect('/');
        const router = getRouter('mount');
        expect(window.location.pathname).toEqual('/');

        const link = router.find(Link).at(1);
        link.simulate('click');

        expect(window.location.pathname).toEqual('/item');
        expect(window.scrollTo).toHaveBeenCalledTimes(1);
        expect(router.find(Component2)).toHaveLength(1);
        expect(router.html()).toEqual('<div></div>');

        const linkThen = router.find(Link).at(1);
        const anchorEl = linkThen.find('a');
        expect(anchorEl.prop('className')).toEqual('active');
    });

    it('pathname="/item?ciao=ok#yo" renders Component2, respect search', async () => {
        redirect('/');
        const router = getRouter('mount');
        expect(window.location.pathname).toEqual('/');

        const link = router.find(Link).at(2);
        const anchorEl = link.find('a');
        expect(anchorEl.prop('href')).toEqual('/item?hello=world#scroll');
    });

    it('pathname="/item?ciao=ok#yo" renders Component2, respect search also when based', async () => {
        redirect('/user');
        const router = getBasedRouter('mount');
        expect(window.location.pathname).toEqual('/user');

        const link = router.find(Link).at(2);
        const anchorEl = link.find('a');
        expect(anchorEl.prop('href')).toEqual('/user/item?hello=world#scroll');
    });
});

describe('@withRouter', async () => {
    it('renders with router={}', async () => {
        redirect('/hoc');
        const router = getRouter('mount');
        expect(window.location.pathname).toEqual('/hoc');

        expect(router.find(ComponentWithRouter)).toHaveLength(1);
        expect(router.find(Component1)).toHaveLength(1);
        expect(router.find(Component1).prop('router')).toBeObject(true);
        expect(router.find(Component1).prop('router')).toContainKeys(['pathname', 'params']);
    });
});