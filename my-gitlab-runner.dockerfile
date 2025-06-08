FROM gitlab/gitlab-runner:ubuntu-v18.0.2

RUN curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

COPY config.toml /etc/gitlab-runner/config.toml

# RUN gitlab-runner register -n \
#   --url "https://gitlab.com/" \
#   --registration-token REGISTRATION_TOKEN \
#   --executor docker \
#   --description "My Docker Runner" \
#   --docker-image "docker:24.0.5" \
#   --docker-privileged \
#   --docker-volumes "/certs/client"

ENTRYPOINT [ "gitlab-runner", "run", "--config", "/etc/gitlab-runner/config.toml" ]