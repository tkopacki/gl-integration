FROM node:10

EXPOSE 8080
ENV DOCKERAPI "https://192.168.0.1:2375"
ENV GITLABAPI "https://gitlab.com"
ENV NODEREDTMPL "http://192.168.0.2"

COPY src/* /
RUN npm install
CMD ["npm", "start"]