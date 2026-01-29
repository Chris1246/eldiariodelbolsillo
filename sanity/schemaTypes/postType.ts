import { defineType, defineField } from "sanity";
import type { SanityDocument, PreviewValue } from "sanity";

type PostDocument = SanityDocument & {
  featured?: boolean;
};

type PostPreviewSelection = {
  title?: string;
  media?: PreviewValue["media"];
  featured?: boolean;
  date?: string;
};

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(10),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "featured",
      title: "Featured (Portada del día)",
      type: "boolean",
      initialValue: false,
      description: "Si está activado, este post puede aparecer como Portada del Día.",
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt (Bajada corta)",
      type: "text",
      rows: 3,
      description: "1–2 líneas. Aparece en la portada y ayuda en SEO.",
      validation: (Rule) => Rule.max(200),
    }),

    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "Describe la imagen para accesibilidad/SEO.",
          validation: (Rule) =>
            Rule.custom((alt, context: { document?: SanityDocument }) => {
              const doc = context.document as PostDocument | undefined;
              const isFeatured = Boolean(doc?.featured);

              if (isFeatured && (!alt || alt.trim().length < 5)) {
                return "Para un post Featured, el ALT es obligatorio (mínimo 5 caracteres).";
              }
              return true;
            }),
        }),
      ],
      validation: (Rule) =>
        Rule.custom((img, context: { document?: SanityDocument }) => {
          const doc = context.document as PostDocument | undefined;
          const isFeatured = Boolean(doc?.featured);

          if (isFeatured && !img) {
            return "Para un post Featured, la imagen principal es obligatoria.";
          }
          return true;
        }),
    }),

    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      validation: (Rule) => Rule.min(1),
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "mainImage",
      featured: "featured",
      date: "publishedAt",
    },
    prepare(selection: PostPreviewSelection): PreviewValue {
      const title = selection.title ?? "Sin título";
      const featured = Boolean(selection.featured);
      const date = selection.date;

      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: date ? new Date(date).toLocaleString("es-CL") : "",
        media: selection.media as PreviewValue["media"],
      };
    },
  },
});
