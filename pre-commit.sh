if [ -d  "dist"  ]; then
	rm -rf dist
fi

if [ -f "./bin/pre-commit.sh" ]; then
	. ./bin/pre-commit.sh
else
	npm run pre-commit --if-present
fi
if [ -d ".git" ]; then
	git add -U
	echo "prepreared for commiting... hopefully nothing broke D:"
fi
