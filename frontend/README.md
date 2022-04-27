# Client setup

Initialize the frontent project
> $ cd frontend
>
> $ npm init -y

Instructions how to configure Next.js (https://nextjs.org/docs)
> $ npm install --save next react react-dom

To have next.config.js parameters extract next.config.zip file with public secret password ;)

Instructions how to configure Reactstrap (https://reactstrap.github.io)
> $ npm install --save reactstrap react react-dom

To run client:
> $ npm run dev

To send user information to backend we need a HTTP client.
> $ npm i isomorphic-fetch

`isomorphic-fetch works in both client and server side`

To manage cookies we need to install additional package:
> $ npm i js-cookie

To have a progress animation during page loading install this package:
> $ npm i nprogress

`DEPRECATED:` To use CSS styles in next.js we must install:
> $ npm i @zeit/next-css

To create rich text editor install:
> $ npm install --save react-quill@beta

If you have any problem with npm install code ETARGET for specific <npm_package>:
> $ npm view <npm_package>

Then install latest version of <npm_package>, i.e.:
> $ npm i --save-dev <npm_package>@X.X.X

To use pretty timestamp format install:
> $ npm i moment

To render text as html within page install:
> $npm i --save --lecagy-peer-deps react-render-html
