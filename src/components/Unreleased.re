let component = ReasonReact.statelessComponent("RepoLine");

let text = ReasonReact.string;

[@bs.deriving abstract]
type target = {
  oid: string,
  [@bs.as "target"]
  target0: option(target),
};

[@bs.deriving abstract]
type ref = {
  [@bs.as "name"]
  refName: string,
  target,
};

[@bs.deriving abstract]
type release = {
  tag: ref,
  url: string,
};

[@bs.deriving abstract]
type releases = {nodes: array(release)};

[@bs.deriving abstract]
type repo = {
  id: string,
  name: string,
  [@bs.as "url"]
  repoUrl: string,
  releases,
  defaultBranchRef: ref,
};

let lastReleaseData = repo => {
  let releases = repo->releasesGet->nodesGet->Array.to_list;
  switch (releases) {
  | [] => None
  | [release, ..._] =>
    let tag = release->tagGet;
    let target = tag->targetGet;
    let actualTarget =
      switch (target->target0Get) {
      | None => target
      | Some(t) => t
      };
    let url = release->urlGet;
    let name = tag->refNameGet;
    Some((actualTarget->oidGet, url, name));
  };
};

let lastRelease =
  fun
  | None => text("-")
  | Some((_oid, url, name)) => <a href=url> {text(name)} </a>;

let outstanding = (repo, releaseOpt) => {
  let defaultBranchRef = repo->defaultBranchRefGet;
  let lastOid = defaultBranchRef->targetGet->oidGet;
  switch (releaseOpt) {
  | None => text("-")
  | Some((oid, _url, _name)) when oid == lastOid => text("-")
  | Some((_oid, _url, releaseName)) =>
    let url =
      Printf.sprintf(
        "%s/compare/%s...%s",
        repo->repoUrlGet,
        releaseName,
        defaultBranchRef->refNameGet,
      );

    <a href=url> {text("compare")} </a>;
  };
};

let make = (~repo, _children) => {
  ...component,
  render: _self => {
    let releaseOpt = lastReleaseData(repo);
    <tr key={repo->idGet}>
      <td> {text(repo->nameGet)} </td>
      <td> {lastRelease(releaseOpt)} </td>
      <td> {outstanding(repo, releaseOpt)} </td>
    </tr>;
  },
};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(~repo=jsProps##repo, [||])
  );
