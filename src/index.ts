// import * as Button from './components/lib/button';


import './components/root/root';

import {initDocumentHeadStyleNode} from "./common/web-component-globals";
import {ZInput} from "./components/lib/input/input";
import {ZButton} from "./components/lib/button/button";

initDocumentHeadStyleNode(require('./style.less'), 'global');

new ZInput();
new ZButton();

