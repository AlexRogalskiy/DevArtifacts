# React SidebarJS
Create mobile sidebar/sidenav experiance in react.

```ssh
npm install react-sidebarjs --save
```

## Demo
*Open the demo on your device and try the touch gestures!*

* [RawGit](https://rawgit.com/SidebarJS/react-sidebarjs/master/demo/build/index.html)

## Import
```js
import {SidebarJS, sidebarService} from 'react-sidebarjs';
```

## Implementation

```js
import {SidebarJS, sidebarService} from 'react-sidebarjs';
import {NavLink} from 'react-router-dom';

<SidebarJS sidebarjsName="MainSidebar">
  <h3>React SidebarJS</h3>
  <nav>
    <NavLink
      to="/home"
      onClick={() => sidebarService.close('MainSidebar')}>
      Home 
    </NavLink>
  </nav>
</SidebarJS>
```

## API

```js
<SidebarJS
  sidebarjsName={/* string */}
  sidebarjsConfig={/* SidebarConfig | See: https://github.com/SidebarJS/sidebarjs#options */}
  onOpen={() => void}
  onClose={() => void}
  onChangeVisibility={(changes: {isVisible: boolean}) => void}>
</SidebarJS>
```