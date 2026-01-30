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
export const HOME_QUERY = groq`
{
  "hero": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
    | order(featured desc, coalesce(publishedAt, _createdAt) desc)[0]{
      _id,
      title,
      excerpt,
      featured,
      publishedAt,
      "slug": { "current": slug.current },
      "mainImageUrl": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      categories[]->{title, "slug": { "current": slug.current }}
    },

  "today": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
    | order(coalesce(publishedAt, _createdAt) desc)[0...6]{
      _id,
      title,
      excerpt,
      featured,
      publishedAt,
      "slug": { "current": slug.current },
      categories[]->{title, "slug": { "current": slug.current }}
    },

  "economiaInCategory": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && "economia-en-simple" in categories[]->slug.current]
    | order(coalesce(publishedAt, _createdAt) desc)[0...2]{
      _id,
      title,
      excerpt,
      featured,
      publishedAt,
      "slug": { "current": slug.current },
      categories[]->{title, "slug": { "current": slug.current }}
    },

  "economiaFallback": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**")) && (title match '*economía en simple*' || excerpt match '*economía en simple*')]
    | order(coalesce(publishedAt, _createdAt) desc)[0...2]{
      _id,
      title,
      excerpt,
      featured,
      publishedAt,
      "slug": { "current": slug.current },
      categories[]->{title, "slug": { "current": slug.current }}
    },

  "latest": *[_type == "post" && defined(slug.current) && !(_id in path("drafts.**"))]
    | order(coalesce(publishedAt, _createdAt) desc)[0...20]{
      _id,
      title,
      excerpt,
      featured,
      publishedAt,
      "slug": { "current": slug.current },
      "mainImageUrl": mainImage.asset->url,
      "mainImageAlt": mainImage.alt,
      categories[]->{title, "slug": { "current": slug.current }}
    }
}
`