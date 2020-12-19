vue-h5-template
============
Author: licuiting
## git address
``` js
git@10.200.51.105:f2e/vue-h5-template.git
```

## vim ./config/index.js
``` js
module.exports = {
  build: {
    index: path.resolve(__dirname, '../dist/xxx/html/index.html'), //xxx: product name
    assetsSubDirectory: 'xxx', //xxx: product name
    assetsPublicPath: 'http://s1.bbgstatic.com/', //static path
```


## Contents 
1. install

``` js
npm install
```
2. start

``` js
npm start
```
3. build

``` js
npm run build
```
4. modify webservice configuration
nginx

``` js
 location / {
	try_files $uri $uri/ /index.html;
}
```

5. open in chrome 

``` js
open -n /Applications/Google\ Chrome.app/ --args --disable-web-security  --user-data-dir=/Users/licuiting/MyChromeDevUserData/ 
```

for mac
[download phantomjs](http://phantomjs.org/download.html)

``` js
vi .bash_profile
export PATH=/Users/chancriss/Phantomjs/bin:$PATH
source .bash_profile
```

## Reference 
1. es6, es7, es8
1. [webpack](https://webpack.js.org/)
1. Vue.js devtools
1. [vue](https://vuejs.org/) 
1. [vue-router](https://router.vuejs.org/en/) 
1. [vuex](https://vuex.vuejs.org/en/)
1. [mockjs](http://mockjs.com/)
