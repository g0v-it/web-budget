module.exports = {
    root: true,
    extends: [
        // add more generic rulesets here, such as:
        'eslint:recommended',
        /*  'plugin:vue/strongly-recommended', */
        'plugin:vue/essential',
          'plugin:prettier/recommended'
    ],
    rules: {
        // override/add rules settings here, such as:
        "vue/max-attributes-per-line": [2, {
            "singleline": 2,
            "multiline": {
                "max": 2,
                "allowFirstLine": false
            }
        }]
    }
}