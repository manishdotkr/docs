import React from 'react'
import { DocsThemeConfig } from 'nextra-theme-docs'

const config: DocsThemeConfig = {
  // logo: <span>Docs</span>,
  logo: <img src="/assets/logo.png" alt="Logo" style={{ width: '120px', height: 'auto' }} />,
  project: {
    link: 'https://github.com/manishdotkr',
  },
  docsRepositoryBase: 'https://github.com/manishdotkr/docs',
  footer: {
    text: 'Nextra Docs Template',
  },
  sidebar: {
    defaultMenuCollapseLevel: 1, // Set to 1 to collapse all by default
    titleComponent: ({ title, type }) => <>{title}</>,
  },
}

export default config;
