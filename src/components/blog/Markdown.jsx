// src/components/blog/Markdown.jsx
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { clsx } from "clsx";

/**
 * Renders post bodies. Raw HTML in the source is dropped, links and image URLs go through
 * react-markdown's protocol allow-list, and every element is styled here so no global
 * typography plugin is required.
 *
 * size "article" is the public reading view, "compact" is the admin live preview.
 */

const REMARK_PLUGINS = [remarkGfm];

// Only these URL schemes (or relative URLs) are ever rendered from post content.
const SAFE_URL = /^(?:https?:|mailto:|tel:|\/|#)/i;
const isSafeUrl = (value) => typeof value === "string" && SAFE_URL.test(value.trim());

const DISPLAY = "font-[family-name:var(--font-blog-display,system-ui,sans-serif)]";

const SIZES = {
  article: {
    root: "text-[1.1875rem] leading-[1.85]",
    p: "my-6",
    h2: "mt-14 mb-4 text-3xl sm:text-[2rem]",
    h3: "mt-10 mb-3 text-2xl",
    h4: "mt-8 mb-2 text-xl",
    quote: "my-10 pl-6 text-[1.4rem] leading-snug",
    pre: "my-8 p-5 text-sm",
    img: "my-10",
  },
  compact: {
    root: "text-base leading-7",
    p: "my-4",
    h2: "mt-8 mb-3 text-2xl",
    h3: "mt-6 mb-2 text-xl",
    h4: "mt-5 mb-2 text-lg",
    quote: "my-6 pl-4 text-lg leading-snug",
    pre: "my-5 p-4 text-[13px]",
    img: "my-6",
  },
};

function buildComponents(size) {
  const s = SIZES[size];
  const heading = (className) =>
    function Heading({ children }) {
      const Tag = className.tag;
      return <Tag className={clsx(DISPLAY, "font-semibold leading-tight tracking-tight text-stone-950", className.styles)}>{children}</Tag>;
    };

  return {
    h1: heading({ tag: "h2", styles: s.h2 }),
    h2: heading({ tag: "h2", styles: s.h2 }),
    h3: heading({ tag: "h3", styles: s.h3 }),
    h4: heading({ tag: "h4", styles: s.h4 }),
    h5: heading({ tag: "h4", styles: s.h4 }),
    h6: heading({ tag: "h4", styles: s.h4 }),

    // An image on its own line must not be wrapped in <p> (block content inside <p> is invalid).
    p({ node, children }) {
      const onlyImage =
        node?.children?.length === 1 && node.children[0].tagName === "img";
      return onlyImage ? <>{children}</> : <p className={s.p}>{children}</p>;
    },

    a({ href = "", children }) {
      if (!isSafeUrl(href)) return <span>{children}</span>;
      const className =
        "font-medium text-amber-800 underline decoration-amber-400/70 decoration-2 underline-offset-4 transition-colors hover:decoration-amber-600";
      if (href.startsWith("/") && !href.startsWith("//")) {
        return <Link href={href} className={className}>{children}</Link>;
      }
      if (href.startsWith("#")) {
        return <a href={href} className={className}>{children}</a>;
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer nofollow" className={className}>
          {children}
        </a>
      );
    },

    strong: ({ children }) => <strong className="font-semibold text-stone-950">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    del: ({ children }) => <del className="text-stone-500">{children}</del>,

    ul: ({ children, className }) => (
      <ul className={clsx("my-6 space-y-2 marker:text-amber-500", className?.includes("contains-task-list") ? "list-none pl-0" : "list-disc pl-6")}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-6 list-decimal space-y-2 pl-6 marker:font-semibold marker:text-amber-700">{children}</ol>
    ),
    li: ({ children }) => <li className="pl-1">{children}</li>,
    input: ({ type, checked }) =>
      type === "checkbox" ? (
        <input type="checkbox" checked={Boolean(checked)} disabled readOnly className="mr-2 size-4 translate-y-0.5 accent-amber-500" />
      ) : null,

    blockquote: ({ children }) => (
      <blockquote className={clsx("border-l-4 border-amber-400 italic text-stone-900 [&>p]:my-0", s.quote)}>
        {children}
      </blockquote>
    ),

    hr: () => <hr className="mx-auto my-12 w-16 border-0 border-t-2 border-amber-400" />,

    pre: ({ children }) => (
      <pre className={clsx("overflow-x-auto rounded-2xl bg-stone-950 leading-relaxed text-stone-100", s.pre)}>
        {children}
      </pre>
    ),
    code({ inline, children }) {
      return inline ? (
        <code className="rounded-md bg-stone-100 px-1.5 py-0.5 font-mono text-[0.85em] text-stone-800">{children}</code>
      ) : (
        <code className="font-mono">{children}</code>
      );
    },

    img({ src, alt }) {
      if (!isSafeUrl(src)) return null;
      return (
        <span className={clsx("block", s.img)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt || ""} loading="lazy" decoding="async" className="w-full rounded-2xl bg-stone-100" />
          {alt ? <span className="mt-3 block text-center text-sm leading-snug text-stone-500">{alt}</span> : null}
        </span>
      );
    },

    table: ({ children }) => (
      <div className="my-8 overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full border-collapse text-left text-[0.92em]">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-stone-50 text-stone-900">{children}</thead>,
    th: ({ children }) => <th className="border-b border-stone-200 px-4 py-3 font-semibold">{children}</th>,
    td: ({ children }) => <td className="border-b border-stone-100 px-4 py-3 align-top">{children}</td>,
  };
}

const COMPONENTS = {
  article: buildComponents("article"),
  compact: buildComponents("compact"),
};

export default function Markdown({ source = "", size = "article", className }) {
  return (
    <div
      className={clsx(
        "font-[family-name:var(--font-blog-reading,Georgia,serif)] text-stone-800 [overflow-wrap:anywhere]",
        SIZES[size].root,
        className
      )}
    >
      <ReactMarkdown remarkPlugins={REMARK_PLUGINS} components={COMPONENTS[size]} skipHtml>
        {source}
      </ReactMarkdown>
    </div>
  );
}