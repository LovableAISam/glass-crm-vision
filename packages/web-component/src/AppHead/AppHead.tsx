import React from 'react';
import Head from 'next/head';

type AppHeadProps = {
  title: string;
  color: string;
  logo: React.ReactNode;
  asPath: string;
}

export default function AppHead(props: AppHeadProps) {
  const { title, color, logo, asPath } = props;

  // TODO: adjust this with image
  const ogImage = '';

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      {/* PWA primary color */}
      <meta name="theme-color" content={color} />
      <link rel="shortcut icon" href={ogImage} />

      {/* Open Graph */}
      <meta property="og:type" content="Website" />
      <meta property="og:url" content={asPath} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={title} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={asPath} />
      <meta name="twitter:creator" content="@sertikom" />
      <meta name="twitter:image" content={ogImage} />
      {logo}
    </Head>
  )
}