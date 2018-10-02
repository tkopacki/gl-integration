FROM node:10

ENV PORT 8080
ENV INTTOKEN "gl_integration_token"
ENV APITOKEN "gl_api_token"
ENV DOCKERAPI "https://192.168.0.1:2375"
ENV GITLABAPI "https://gitlab.com"
ENV NODEREDTMPL "http://192.168.0.2"

COPY src/* /
RUN npm install
CMD ["npm", "start"]