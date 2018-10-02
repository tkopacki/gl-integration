const { createContainer, removeContainer } = require("./docker.js");

function handleRequest(body) {
    jbody = JSON.parse(body);
    switch (jbody.object_kind) {
        case "push":
            handlePush(jbody);
            break;
        case "merge_request":
            handleMergeRequest(jbody);
            break;
    }
}

function handlePush(body) {
    let ref = body.ref;
    let projectID = body.project_id;
    let issueID = ref.substring(ref.lastIndexOf("/") + 1, ref.indexOf("-"));
    let branch = ref.substring(ref.lastIndexOf("/") + 1);
    if(body.before == "0000000000000000000000000000000000000000") {
        console.log("New branch, order node-red instance for ticket: " + issueID);
        createContainer(projectID, issueID, 'nodered-' + projectID + "-" + issueID, body.project.name, body.project.path_with_namespace, branch);
    }
}

function handleMergeRequest(body) {
    let sourceBranch = body.object_attributes.source_branch;
    let projectID = body.project.id;
    let issueID = sourceBranch.substring(0, sourceBranch.indexOf("-"));
    let state = body.object_attributes.state;
    if(state == "merged") {
        console.log("Branch merged for issue " + issueID);
        removeContainer('nodered-' + projectID + "-" + issueID);
    }
}

module.exports = handleRequest;