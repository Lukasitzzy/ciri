GIT_VERSION="$(git --version)"
echo "${GIT_VERSION:12:-10}"

