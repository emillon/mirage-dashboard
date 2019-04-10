import React from "react"
import moment from "moment"
import UserIcon from "../components/user-icon"
import { graphql } from "gatsby"

const Row = ({ pr }) => (
  <tr key={pr.id}>
    <td>{pr.repository.name}</td>
    <td>
      <a href={pr.url}>{pr.title}</a>
    </td>
    <td>
      <UserIcon user={pr.author} />
    </td>
    <td>
      <UserIcon user={pr.mergedBy} />
    </td>
    <td>{moment(pr.closedAt).fromNow()}</td>
  </tr>
)

const PrTable = ({ prs }) => (
  <table>
    <thead>
      <tr>
        <th>Repo</th>
        <th>Title</th>
        <th>Author</th>
        <th>Merged by</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {prs.map(pr => (
        <Row key={pr.id} pr={pr} />
      ))}
    </tbody>
  </table>
)

export default PrTable

export const query = graphql`
  fragment PrFragment on ONEGRAPH_GitHubPullRequest {
    id
    url
    title
    closedAt
    author {
      ...UserIconFragment
    }
    mergedBy {
      ...UserIconFragment
    }
    repository {
      name
    }
  }
`
