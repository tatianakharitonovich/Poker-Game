module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:react/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  plugins: [
    "import",
    "import-newlines",
    "@typescript-eslint/eslint-plugin",
    "react-hooks",
  ],
  rules: {
    "arrow-body-style": "off",
    "arrow-parens": "off",
    "class-methods-use-this": "off",
    "consistent-return": "off",
    curly: ["error", "all"], // stricter than airbnb has
    "default-case": "off",
    "function-paren-newline": "off",
    "global-require": "warn",
    "implicit-arrow-linebreak": "off",
    "max-classes-per-file": "off",
    "max-len": [
      "error",
      {
        code: 140,
        comments: 0,
        ignorePattern: `^import |/.+eslint-.+able|//|"[^"]{100,}"`,
      },
    ],
    "newline-per-chained-call": "off",
    "no-await-in-loop": "off",
    "no-case-declarations": "off",
    "no-confusing-arrow": "off",
    "no-console": "warn",
    "no-continue": "off",
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-inner-declarations": "off", // not actual since we target only ES6
    "no-irregular-whitespace": [
      "error",
      {
        // stricter than airbnb has
        skipStrings: false,
        skipComments: false,
        skipRegExps: false,
        skipTemplates: false,
      },
    ],
    "no-mixed-operators": [
      "error",
      {
        groups: [
          ["??", "==", "!=", "===", "!=="], // block `a ?? b === c` and similar
        ],
      },
    ],
    "no-nested-ternary": "off",
    "no-param-reassign": ["warn", { props: false }],
    "no-plusplus": "off",
    "no-prototype-builtins": "warn",
    "no-restricted-globals": "off",
    "no-restricted-properties": [
      "error",
      {
        object: "process",
        property: "env",
        message: "Use strongly typed BUILD_OPTIONS instead. See MOBREF-1628",
      },
      {
        object: "arguments",
        property: "callee",
        message: "arguments.callee is deprecated",
      },
    ],
    "no-restricted-syntax": [
      "error",
      {
        selector: "LabeledStatement",
        message:
          "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
      },
      {
        selector: "WithStatement",
        message:
          "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
      },
    ],
    "no-underscore-dangle": "off",
    "no-useless-escape": "warn", // there are places where escape make sense even if not strictly required. For example `/[[\]]/` vs `/[\[\]]/`
    "object-curly-newline": [
      "error",
      {
        ObjectExpression: { multiline: true, consistent: true },
        ObjectPattern: { multiline: true, consistent: true },
        ImportDeclaration: { multiline: true, consistent: true },
        ExportDeclaration: { multiline: true, consistent: true },
      },
    ],
    "object-shorthand": "off", // NOTE: we have our own rule - evo/object-shorthand
    "operator-linebreak": "off",
    "prefer-arrow-callback": [
      "error",
      {
        allowNamedFunctions: true,
        allowUnboundThis: true,
      },
    ],
    "prefer-destructuring": "off",
    "prefer-exponentiation-operator": "warn",
    "prefer-promise-reject-errors": ["warn", { allowEmptyReject: true }],
    "prefer-spread": "off",
    "prefer-template": "warn",
    "quote-props": ["warn", "consistent-as-needed"],
    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/await-thenable": "warn",
    "@typescript-eslint/ban-ts-comment": [
      "warn",
      {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": "allow-with-description",
        "ts-nocheck": "allow-with-description",
        "ts-check": false,
        minimumDescriptionLength: 3,
      },
    ],
    "@typescript-eslint/ban-tslint-comment": "error",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/consistent-indexed-object-style": ["warn", "record"],
    "@typescript-eslint/consistent-type-exports": [
      "warn",
      { fixMixedExportsWithInlineTypeSpecifier: true },
    ],
    "@typescript-eslint/dot-notation": ["warn", { allowKeywords: true }],
    "@typescript-eslint/explicit-member-accessibility": [
      "error",
      { accessibility: "explicit" },
    ],
    "@typescript-eslint/explicit-module-boundary-types": [
      "warn",
      {
        allowArgumentsExplicitlyTypedAsAny: false,
        allowDirectConstAssertionInArrowFunctions: true,
        allowedNames: [
          // ignore React lifecycle methods
          "render",
          "getInitialState",
          "getDefaultProps",
          "getChildContext",
          "componentWillMount",
          "UNSAFE_componentWillMount",
          "componentDidMount",
          "componentWillReceiveProps",
          "UNSAFE_componentWillReceiveProps",
          "shouldComponentUpdate",
          "componentWillUpdate",
          "UNSAFE_componentWillUpdate",
          "componentDidUpdate",
          "componentWillUnmount",
          "componentDidCatch",
          "getSnapshotBeforeUpdate",
        ],
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    "@typescript-eslint/indent": [
      "error",
      4,
      {
        SwitchCase: 1,
        VariableDeclarator: 1,
        outerIIFEBody: 1,
        MemberExpression: 1,
        FunctionDeclaration: {
          parameters: 1,
          body: 1,
        },
        FunctionExpression: {
          parameters: 1,
          body: 1,
        },
        CallExpression: {
          arguments: 1,
        },
        ArrayExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1,
        flatTernaryExpressions: false,
        ignoredNodes: [
          // airbnb list
          "JSXElement",
          "JSXElement > *",
          "JSXAttribute",
          "JSXIdentifier",
          "JSXNamespacedName",
          "JSXMemberExpression",
          "JSXSpreadAttribute",
          "JSXExpressionContainer",
          "JSXOpeningElement",
          "JSXClosingElement",
          "JSXFragment",
          "JSXOpeningFragment",
          "JSXClosingFragment",
          "JSXText",
          "JSXEmptyExpression",
          "JSXSpreadChild",
          "TemplateLiteral ConditionalExpression",
          "TemplateLiteral CallExpression",
          "TemplateLiteral TemplateElement",
          "TSTypeParameterInstantiation",
          "ExpressionStatement CallExpression ArrowFunctionExpression",
          "TSPropertySignature TSTypeAnnotation",
          "Identifier TSTypeAnnotation",
          "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key",
        ],
        ignoreComments: false,
      },
    ],
    "@typescript-eslint/quotes": [
      "error",
      "double",
      { allowTemplateLiterals: true, avoidEscape: true },
    ],
    "@typescript-eslint/lines-between-class-members": [
      "warn",
      "always",
      { exceptAfterSingleLine: true },
    ],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        multiline: {
          requireLast: true,
          delimiter: "semi",
        },
        singleline: {
          requireLast: true,
          delimiter: "semi",
        },
      },
    ],
    "@typescript-eslint/member-ordering": [
      "error",
      {
        default: [
          "public-static-field",
          "public-static-method",

          "protected-static-field",
          "protected-static-method",

          "private-static-field",
          "private-static-method",

          "public-abstract-field",
          "protected-abstract-field",

          "public-instance-field",
          "protected-instance-field",
          "private-instance-field",

          "constructor",

          "public-abstract-method",
          "protected-abstract-method",

          "public-instance-method",
          "protected-instance-method",
          "private-instance-method",

          "method",
        ],
        interfaces: "never",
        typeLiterals: "never",
      },
    ],
    "@typescript-eslint/no-empty-interface": "warn",
    "@typescript-eslint/no-explicit-any": ["warn"],
    "@typescript-eslint/no-extra-non-null-assertion": "error",
    "@typescript-eslint/no-floating-promises": [
      "warn",
      {
        ignoreVoid: false,
        ignoreIIFE: false,
      },
    ],
    "@typescript-eslint/no-for-in-array": "error",
    "@typescript-eslint/no-inferrable-types": "warn",
    "@typescript-eslint/no-loop-func": "off",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-misused-promises": [
      "warn",
      {
        checksConditionals: true,
        checksVoidReturn: true,
      },
    ],
    "@typescript-eslint/no-namespace": ["error"],
    "@typescript-eslint/no-shadow": [
      "warn",
      {
        ignoreTypeValueShadow: false,
        ignoreFunctionTypeParameterNameValueShadow: true,
      },
    ],
    "@typescript-eslint/no-this-alias": ["error"],
    "@typescript-eslint/unbound-method": [
      "warn",
      {
        ignoreStatic: false,
      },
    ],
    "@typescript-eslint/no-unnecessary-type-assertion": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/no-unused-expressions": [
      "error",
      {
        allowShortCircuit: false,
        allowTernary: true,
        allowTaggedTemplates: false,
        enforceForJSX: true,
      },
    ],
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-var-requires": "warn",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/prefer-as-const": "error",
    "@typescript-eslint/prefer-for-of": ["error"],
    "@typescript-eslint/prefer-namespace-keyword": "error",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "@typescript-eslint/triple-slash-reference": [
      "error",
      { path: "never", types: "never", lib: "never" },
    ],
    "@typescript-eslint/type-annotation-spacing": ["error"],
    "@typescript-eslint/require-await": "warn",
    "import/no-default-export": "error",
    "import/no-dynamic-require": "warn",
    "import/no-extraneous-dependencies": "off",
    "import/no-unassigned-import": ["error", { allow: ["react", "**/*.css"] }],
    "import/no-webpack-loader-syntax": "off",
    "import/prefer-default-export": "off",
    "import-newlines/enforce": [
      "warn",
      {
        items: Infinity,
        "max-len": 120,
        semi: true,
        forceSingleLine: false,
      },
    ],
    "react/button-has-type": "off",
    "react/default-props-match-prop-types": "off",
    "react/destructuring-assignment": ["warn", "always"],
    "react/function-component-definition": "off",
    "react/jsx-boolean-value": ["error", "always"],
    "react/jsx-curly-newline": "off",
    "react/jsx-curly-spacing": ["error", { when: "never", children: true }], // no children check in airbnb
    "react/jsx-indent": [
      "error",
      4,
      { checkAttributes: true, indentLogicalExpressions: true },
    ],
    "react/jsx-indent-props": ["error", 4],
    "react/jsx-no-bind": [
      "error",
      {
        // stricter than airbnb has
        ignoreRefs: false,
        allowArrowFunctions: true,
        allowFunctions: true,
        allowBind: false,
        ignoreDOMComponents: false,
      },
    ],
    "react/jsx-no-constructed-context-values": "warn",
    "react/jsx-one-expression-per-line": "off",
    "react/jsx-props-no-spreading": "off",
    "react/no-access-state-in-setstate": "warn",
    "react/no-array-index-key": "warn",
    "react/no-children-prop": "warn",
    "react/no-deprecated": ["warn"],
    "react/no-did-update-set-state": "warn",
    "react/no-unused-state": "warn",
    "react/prefer-stateless-function": [
      "warn",
      { ignorePureComponents: false },
    ], // stricter than airbnb has
    "react/prop-types": "off",
    "react/require-default-props": "off",
    "react/sort-comp": "off",
    "react/state-in-constructor": "off",
    "react/static-property-placement": "off",
    "react/jsx-no-useless-fragment": "off",

    // ****************** react-hooks ******************
    // https://reactjs.org/docs/hooks-rules.html

    "react-hooks/exhaustive-deps": "warn",

    // ****************** jsx-a11y ******************
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y
    // at the moment we don't really need to care about accessibility

    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/alt-text": "off",
    "jsx-a11y/aria-role": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/control-has-associated-label": "off",
    "jsx-a11y/iframe-has-title": "off",
    "jsx-a11y/img-redundant-alt": "off",
    "jsx-a11y/interactive-supports-focus": "off",
    "jsx-a11y/label-has-associated-control": "off",
    "jsx-a11y/media-has-caption": "off",
    "jsx-a11y/mouse-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/no-redundant-roles": "off",
    "jsx-a11y/no-static-element-interactions": "off",
  },
};
