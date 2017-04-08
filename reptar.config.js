const config = {
  site: {
    title: "Complete Intro to React",
    email: null,
    description: "A Complete Intro to React, as taught for FrontendMasters.com\n",
    baseurl: "",
    url: "https://btholt.github.io/complete-intro-to-react"
  },
  path: {
    source: "./",
    destination: "./_site",
    data: "./_data"
  },
  file: {
    urlKey: "url",
    dateFormat: "YYYY-M-D",
    defaults: [
      {
        scope: { path: "./" },
        values: { template: "page", permalink: "/:title/" }
      },
      {
        scope: { path: "./_posts" },
        values: { template: "post", permalink: "/:title/" }
      },
      {
        scope: { metadata: { draft: true } },
        values: { template: "draft" }
      }
    ],
    filters: { metadata: { draft: true }, future_date: { key: "date" } }
  },
  collections: {
    post: {
      path: "./_posts",
      template: "index",
      pageSize: 100,
      sort: { key: "date", order: "ascending" },
      permalink: { index: "/", page: "/page/:page/" }
    },
    tag: {
      metadata: "tags",
      template: "tag",
      pageSize: 6,
      sort: { key: "date", order: "descending" },
      permalink: { index: "/tag/:metadata/", page: "/tag/:metadata/:page/" }
    }
  },
  theme: "citr",
  cleanDestination: false,
  slug: { lower: true },
  markdown: {
    extensions: ["markdown", "mkdown", "mkdn", "mkd", "md"],
    options: { preset: "commonmark", highlight: true }
  },
  server: { port: 8010, host: "127.0.0.1", baseurl: "" },
  incremental: true,
  newFilePermalink: "/_posts/:date|YYYY-:date|MM-:date|D-:title.md"
};

module.exports = config;
