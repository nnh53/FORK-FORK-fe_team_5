FROM gitlab/gitlab-runner:ubuntu-v18.0.2

RUN curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh



for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do apt-get remove $pkg; done

# Add Docker's official GPG key:
   apt-get update
   apt-get install ca-certificates curl
   install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   chmod a+r /etc/apt/keyrings/docker.asc

  # Add the repository to Apt sources:
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
     tee /etc/apt/sources.list.d/docker.list > /dev/null
   apt-get update


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