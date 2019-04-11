import React from "react"
import { graphql } from "gatsby"
import Container from "../components/container"

function Release({ url, name }) {
  return url ? <a href={url}>{name}</a> : name
}

class RepoLine extends React.Component {
  lastRelease() {
    const releases = this.props.repo.releases.nodes
    if (releases.length > 0) {
      const release = releases[0]
      const tag = release.tag
      const url = release.url
      const oid =
        "target" in tag.target ? tag.target.target.oid : tag.target.oid
      return <Release oid={oid} name={tag.name} url={url} />
    } else {
      return <Release name="no release" />
    }
  }

  outstanding() {
    const defaultBranchRef = this.props.repo.defaultBranchRef
    const lastOid = defaultBranchRef.target.oid
    const release = this.lastRelease()
    const releaseOid = release.props.oid
    if (lastOid === releaseOid) {
      return "-"
    } else if (!release.props.oid) {
      return "-"
    } else {
      const url =
        this.props.repo.url +
        "/compare/" +
        release.props.name +
        "..." +
        defaultBranchRef.name
      return <a href={url}>compare</a>
    }
  }

  render() {
    return (
      <tr key={this.props.repo.id}>
        <td>{this.props.repo.name}</td>
        <td>{this.lastRelease()}</td>
        <td>{this.outstanding()}</td>
      </tr>
    )
  }
}

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
