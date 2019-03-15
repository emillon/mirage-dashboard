import React from "react"
import { graphql } from "gatsby"
import Container from "../components/container"
import PrTable from "../components/pr-table"
import moment from "moment"

const byClosedAt = (a, b) => {
  const da = new Date(a.closedAt)
  const db = new Date(b.closedAt)
  return (da < db) - (da > db)
}

const isRecent = pr => moment(pr.closedAt).isAfter(moment().subtract(1, "week"))

function flatten(a) {
  return [].concat.apply([], a)
}

class IndexPage extends React.Component {
  repos() {
    const gh = this.props.data.oneGraph.gitHub
    return flatten([
      gh.mirage.repositories.nodes,
      [gh.g2p.wodan, gh.mirleft.asn1c, gh.mirleft.tls, gh.mirleft.x509],
    ])
  }

  prs() {
    const repos = this.repos()
    const prs = flatten(repos.map(repo => repo.pullRequests.nodes)).filter(
      isRecent
    )
    prs.sort(byClosedAt)
    return prs
  }

  render() {
    return (
      <Container>
        <h1>Latest PRs</h1>
        <PrTable prs={this.prs()} />
      </Container>
    )
  }
}

export default IndexPage

export const query = graphql`
  query repos {
    oneGraph {
      gitHub {
        mirage: organization(login: "mirage") {
          repositories(first: 20) {
            nodes {
              ...prs
            }
          }
        }
        g2p: user(login: "g2p") {
          wodan: repository(name: "wodan") {
            ...prs
          }
        }
        mirleft: organization(login: "mirleft") {
          asn1c: repository(name: "ocaml-asn1-combinators") {
            ...prs
          }
          tls: repository(name: "ocaml-tls") {
            ...prs
          }
          x509: repository(name: "ocaml-x509") {
            ...prs
          }
        }
      }
    }
  }

  fragment prs on ONEGRAPH_GitHubRepository {
    pullRequests(
      states: [MERGED]
      first: 20
      orderBy: { field: UPDATED_AT, direction: DESC }
    ) {
      nodes {
        ...PrFragment
      }
    }
  }
`
