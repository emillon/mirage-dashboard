import React from "react"
import { graphql } from "gatsby"
import Container from "../components/container"
import RepoLine from "../components/Unreleased.bs"

class UnreleasedPage extends React.Component {
  repos() {
    return this.props.data.oneGraph.gitHub.organization.repositories.nodes
  }

  render() {
    return (
      <Container>
        <h1>Repos with unreleased commits</h1>
        <table>
          <thead>
            <th>Name</th>
            <th>Last release</th>
            <th>Outstanding commits</th>
          </thead>
          <tbody>
            {this.repos().map(repo => (
              <RepoLine repo={repo} />
            ))}
          </tbody>
        </table>
      </Container>
    )
  }
}

export default UnreleasedPage

export const query = graphql`
  query unreleased {
    oneGraph {
      gitHub {
        organization(login: "mirage") {
          repositories(
            first: 30
            orderBy: { field: PUSHED_AT, direction: DESC }
          ) {
            nodes {
              id
              url
              name
              defaultBranchRef {
                name
                target {
                  oid
                }
              }
              releases(last: 1) {
                nodes {
                  url
                  tag {
                    name
                    target {
                      oid
                      ... on ONEGRAPH_GitHubTag {
                        target {
                          oid
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
