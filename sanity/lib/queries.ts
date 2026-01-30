import { groq } from "next-sanity";

export const POST_BY_SLUG_QUERY = groq`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    excerpt,
    featured,
    publishedAt,
    body,
    "slug": slug.current,
    "mainImageUrl": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    categories[]->{title},
    author->{name}
  }
`; 
