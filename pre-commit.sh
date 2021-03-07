# if [ -d  "dist"  ]; then
# 	rm -rf dist
# fi

# if [ -f "./bin/pre-commit.sh" ]; then
# 	. ./bin/pre-commit.sh
# else
# 	npm run pre-commit --if-present
# fi
# if [ -d ".git" ]; then
# 	git add -u
# 	echo "prepreared for commiting... hopefully nothing broke D:"
# else
# 	exit
# fi
