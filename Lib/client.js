import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
    projectId: 'h56a3dx8',
    dataset: 'production',
    apiVersion: '2026-01-06',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN
});

const builder = createImageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);