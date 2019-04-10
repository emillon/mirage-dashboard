import React from "react"
import userStyles from "./user-icon.module.css"
import { graphql } from "gatsby"

const UserIcon = ({ user }) => (
  <img className={userStyles.icon} src={user.avatarUrl} alt={user.login} />
)

export default UserIcon

export const query = graphql`
  fragment UserIconFragment on ONEGRAPH_GitHubUser {
    login
    avatarUrl
  }
`
