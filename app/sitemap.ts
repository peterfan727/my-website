import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://www.peterfan.dev',
            lastModified: new Date(),
        },
        {
            url: 'https://www.peterfan.dev/about',
            lastModified: new Date(),
        },
        {
            url: 'https://www.peterfan.dev/contact',
            lastModified: new Date(),
        },
        {
            url: 'https://www.peterfan.dev/experience',
            lastModified: new Date(),
        },
        {
            url: 'https://www.peterfan.dev/projects',
            lastModified: new Date(),
        },
        {
            url: 'https://www.peterfan.dev/projects/chatbot',
            lastModified: new Date(),
        },
    ]
}