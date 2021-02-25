if [ -d  "dist"  ]; then
	rm -rf dist
fi

if [ -f "./bin/pre-commit" ]; then
	. ./bin/pre-commit
fi
git add .
git diff
git commit -m "$@"
