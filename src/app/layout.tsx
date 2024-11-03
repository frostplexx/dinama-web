import localFont from 'next/font/local';
import { Analytics } from "@vercel/analytics/react"

import '../styles/globals.scss';
// import * as s from './styles.module.scss';

const jetBrains = localFont({
    src: [
        {
            path: '../assets/fonts/JetBrainsMono-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../assets/fonts/JetBrainsMono-Medium.woff2',
            weight: '500',
            style: 'normal',
        },
        {
            path: '../assets/fonts/JetBrainsMono-SemiBold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../assets/fonts/JetBrainsMono-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
    ],
});

export const metadata = {
    title: 'Daniel Inama',
    description: "some people say I don't exist, but I'm right here",
};

export default function SiteLayout({
    children, // will be a page or nested layout
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta name="theme-color" content="#363a4f" />
            </head>
            <body className={jetBrains.className}>
                <div className="rain" />
                <Analytics />
                <main>
                    {children}
                </main>
            </body>
        </html>
    );
}
