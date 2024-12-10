import meta from "../../../src/pages/_meta.tsx";
import assert_meta from "../../../src/pages/assert/_meta.tsx";
import exception_meta from "../../../src/pages/exception/_meta.tsx";
export const pageMap = [{
  data: meta
}, {
  name: "assert",
  route: "/assert",
  children: [{
    data: assert_meta
  }, {
    name: "index",
    route: "/assert",
    frontMatter: {
      "sidebarTitle": "Index"
    }
  }]
}, {
  name: "dsn-parser",
  route: "/dsn-parser",
  frontMatter: {
    "sidebarTitle": "Dsn Parser"
  }
}, {
  name: "exception",
  route: "/exception",
  children: [{
    data: exception_meta
  }, {
    name: "advanced",
    route: "/exception/advanced",
    frontMatter: {
      "sidebarTitle": "Advanced"
    }
  }, {
    name: "ecosystem",
    route: "/exception/ecosystem",
    frontMatter: {
      "sidebarTitle": "Ecosystem"
    }
  }, {
    name: "index",
    route: "/exception",
    frontMatter: {
      "sidebarTitle": "Index"
    }
  }, {
    name: "recipes",
    route: "/exception/recipes",
    frontMatter: {
      "sidebarTitle": "Recipes"
    }
  }]
}, {
  name: "index",
  route: "/",
  frontMatter: {
    "sidebarTitle": "Index"
  }
}, {
  name: "license",
  route: "/license",
  frontMatter: {
    "sidebarTitle": "License"
  }
}, {
  name: "plain-object",
  route: "/plain-object",
  frontMatter: {
    "sidebarTitle": "Plain Object"
  }
}, {
  name: "sponsors",
  route: "/sponsors",
  frontMatter: {
    "sidebarTitle": "Sponsors"
  }
}];