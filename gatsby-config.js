require("dotenv").config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    title: `Mirage dashboard`,
    description: `This displays info about Mirage packages`,
    author: `@emillon`,
  },
  plugins: [
    {
      resolve: `gatsby-source-graphql`,
      options: {
        typeName: `ONEGRAPH`,
        fieldName: `oneGraph`,
        url: `https://serve.onegraph.com/dynamic?app_id=${
          process.env.ONEGRAPH_APPID
        }`,
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        },
      },
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
  ],
}
