import * as React from 'react';

console.log("env=", process.env.NODE_ENV)
//
export default function Page() { 
    return (
    <html>
        <head>
            <title>welcome</title>
            <script src='https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4'></script>
        </head>
        <div id="app"></div>
        {(process.env.NODE_ENV === "production") ? (
            <script type="module" src="/public/static/client.js"></script>
        ): (
            <script type="module" src="/static/client.js"></script>
        )}
    </html>
    );
}
/*
*/
