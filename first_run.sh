if [ -f "./commands.json" ]; then
    if [ -f "./first_run.js"]; then
        node -r dotenv/config ./first_run.js
        _remove_files
    else
        echo "no ./first_run.js file found.. exit..."
        exit 0

    fi
else
    if [ -f "./first_run.js"]; then
        touch commands.json
        echo "[{  \"name\": \"test\",\n\"description\": \"test\",\"options\":[] }]" >> commands.json
        _remove_files
    else
    fi
fi


function _remove_files() {
    rm ./first_run.js
    rm ./commands.json
}
