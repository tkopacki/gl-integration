const axios = require('axios');

let containerSpec = {
    "Image": "my-nodered",
    "Env": [],
    "ExposedPorts": {
        "1880/tcp": {}
    },
    "HostConfig": {
        "PortBindings": { "1880/tcp": [{ "HostPort": "" }] },
        "RestartPolicy": {
            "Name": "always"
        }
    }
}
const API_SECRET = fs.readFileSync("/var/run/secrets/APITOKEN");

function createContainer(projectID, issueID, name, project, projectWithNamespace, branch) {
    var spec = JSON.parse(JSON.stringify(containerSpec));
    spec.Env[0] = "PROJECT=" + project;
    spec.Env[1] = "PROJECTWITHNAMESPACE=" + projectWithNamespace;
    spec.Env[2] = "BRANCH=" + branch;
    axios({
        method: "POST",
        url: process.env.dockerapi + "/containers/create?name=" + name,
        data: spec
    })
        .then(response => {
            console.log("created, now starting " + name);
            return axios({
                method: "POST",
                url: process.env.dockerapi + "/containers/" + name + "/start",
            })
        })
        .then(response => {
            console.log("started, now inspecting " + name);
            return axios({
                method: "GET",
                url: process.env.dockerapi + "/containers/" + name + "/json",
            })
        })
        .then(response => response.data.NetworkSettings.Ports["1880/tcp"][0]["HostPort"])
        .then(port => {
            console.log("updating GL issue");
            return axios({
                method: "POST",
                url: process.env.gitlabapi + "/api/v4/projects/" + projectID + "/issues/" + issueID + "/notes",
                headers: { "PRIVATE-TOKEN": API_SECRET },
                data: { "body": NODEREDTMPL + ":" + port }
            })
        })
        .catch(error => console.log(error));
}

function removeContainer(name) {
    axios({
        method: "POST",
        url: process.env.dockerapi + "/containers/" + name + "/stop",
    })
        .then(response => {
            console.log("stopped, now deleting " + name); return axios({
                method: "DELETE",
                url: process.env.dockerapi + "/containers/" + name,
            })
        })
        .catch(error => console.log(error));
}

module.exports = { createContainer, removeContainer };