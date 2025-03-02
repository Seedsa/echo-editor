const typeEnum = {
  feat: {
    description: '新功能',
    title: 'Features',
    emoji: '✨',
  },
  fix: {
    description: 'BUG修复',
    title: 'Bug Fixes',
    emoji: '🐛',
  },
  docs: {
    description: '文档变更',
    title: 'Documentation',
    emoji: '📚',
  },
  style: {
    description: '代码样式美化(不影响代码运行的变动)',
    title: 'Styles',
    emoji: '💎',
  },
  refactor: {
    description: '代码重构',
    title: 'Code Refactoring',
    emoji: '📦',
  },
  perf: {
    description: '性能优化',
    title: 'Performance Improvements',
    emoji: '🚀',
  },
  test: {
    description: '测试',
    title: 'Tests',
    emoji: '🚨',
  },
  revert: {
    description: '回退',
    title: 'Reverts',
    emoji: '🗑',
  },
  chore: {
    description: '构建/工程依赖/工具',
    title: 'Chores',
    emoji: '🚀',
  },
}

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', Object.keys(typeEnum)],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [0],
  },
  prompt: {
    messages: {
      skip: ':可选',
      max: '最多 %d 个字符',
      min: '最少 %d 个字符',
      emptyWarning: '此项不能为空',
    },
    questions: {
      type: {
        description: '请选择提交类型',
        enum: typeEnum,
      },
      scope: {
        description: '请输入文件修改范围',
      },
      subject: {
        description: '请简要描述提交',
      },
      body: {
        description: '请输入详细描述',
      },
      isBreaking: {
        description: '是否有任何重大变更?',
      },
      isIssueAffected: {
        description: '此次变更是否影响打开的issues?',
      },
      issuesBody: {
        description: '如果问题已解决，请输入解决的结果',
      },
      issues: {
        description: '添加 issue 参考 (e.g. "fix #123", "re #123".)',
      },
    },
  },
}
