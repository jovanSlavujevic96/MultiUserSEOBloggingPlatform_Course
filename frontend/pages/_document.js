import getConfig from 'next/config';
import Document, { Html, Head, Main, NextScript } from 'next/document';
const { publicRuntimeConfig } = getConfig();

/************************************************
 * Follow backend/README.md setup               *
 * for GoogleAnalytics                          *
 *                                              *
 * https://analytics.google.com                 *
 * Search for the `Install instructions`        *
 * Select         `Install manually`            *
 * Copy source code                             *
 ************************************************

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6D4GTRDT90"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-6D4GTRDT90');
</script>

************************************************/



class MyDocument extends Document {
    setGoogleTags() {
        if (publicRuntimeConfig.PRODUCTION) {
            return {
                __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', 'G-6D4GTRDT90');
                `
            }
        }
    }

    /** it fills this template document on every page */
    render() {
        return (
            <Html lang="en">
                <Head>
                    <meta charSet="UTF-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

                    <link
                        rel="stylesheet"
                        href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.3.1/css/bootstrap.min.css"
                    />

                    <link rel="stylesheet" href="/static/css/styles.css"/>
                    <script async src="https://www.googletagmanager.com/gtag/js?id=G-6D4GTRDT90"></script>
                    <script dangerouslySetInnerHTML={this.setGoogleTags()}></script>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
