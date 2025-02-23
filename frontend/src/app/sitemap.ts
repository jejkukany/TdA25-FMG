import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://13682ac4.app.deploy.tourde.app/',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
        url: 'https://13682ac4.app.deploy.tourde.app/games',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: 'https://13682ac4.app.deploy.tourde.app/game',
        lastModified: new Date(),
        changeFrequency: 'always',
        priority: 1,
      },
      {
        url: 'https://13682ac4.app.deploy.tourde.app/create',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    {
      url: 'https://13682ac4.app.deploy.tourde.app/gdpr',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: 'https://13682ac4.app.deploy.tourde.app/contact',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
  ]
}